---
layout: default
title: Algorithms API
permalink: /api/algorithms/
description: Register custom Proffer detection algorithms.
toc:
  - title: Default Algorithm Library
    url: "#default-algorithm-library"
  - title: register_algorithm
    url: "#profferregister_algorithm"
  - title: Algorithm Types
    url: "#algorithm-types"
  - title: Algorithm Context
    url: "#algorithm-context"
  - title: Custom Unsupervised
    url: "#custom-unsupervised-algorithm"
  - title: Custom Supervised
    url: "#custom-supervised-algorithm"
  - title: Self-supervised Algorithm
    url: "#self-supervised-algorithm"
  - title: Trainable Deep Learning
    url: "#trainable-deep-learning"
  - title: Imported Model
    url: "#imported-model"
  - title: Output
    url: "#output"
  - title: Configure Defaults
    url: "#configure-default-algorithms"
---

<header class="page-header">
  <h1>Algorithms</h1>
  <p>Register custom detection methods that produce one prediction per signal window.</p>
</header>

Proffer provides a built-in algorithm library and supports user-defined detection methods. Custom algorithms can run alongside the built-in collection or independently, and can optionally participate in result fusion. Every algorithm returns one prediction per signal window: `0` means normal and `1` means anomalous.

## Default Algorithm Library

| Type | Algorithm | Configuration name |
| --- | --- | --- |
| Unsupervised | K-Means | `KMeans` |
| Unsupervised | Gaussian mixture model | `GMM` |
| Unsupervised | Histogram-based outlier score | `HBOS` |
| Unsupervised | Local outlier factor | `LOF` |
| Unsupervised | K-nearest neighbors | `KNN` |
| Supervised | XGBoost | `XGBoost` |
| Supervised | Random Forest | `RandomForest` |
| Supervised | Logistic Regression | `LogReg` |
| Supervised | SVM with RBF kernel | `SVM_RBF` |
| Supervised | Extra Trees | `ExtraTrees` |

Built-in unsupervised algorithms can run directly. Built-in supervised algorithms run when their trained models are available and currently use the complete default Proffer feature set.

## `proffer.register_algorithm()`

```python
proffer.register_algorithm(
    algorithm=my_algorithm,
    name="my_algorithm",
    input_type="features",
    kind="unsupervised",
    version="1",
    parameters={},
    participate_in_fusion=True,
    features=None,
)
```

| Parameter | Description |
| --- | --- |
| [`algorithm`]({{ '/api/algorithms/parameters/' | relative_url }}#algorithm) | Module-level function that implements the detector. |
| [`name`]({{ '/api/algorithms/parameters/' | relative_url }}#name) | Name shown to Proffer. If omitted, the function name is used. |
| [`input_type`]({{ '/api/algorithms/parameters/' | relative_url }}#input_type) | Select features, raw signals, or both as algorithm input. |
| [`kind`]({{ '/api/algorithms/parameters/' | relative_url }}#kind) | Describe the algorithm's training and inference role. |
| [`version`]({{ '/api/algorithms/parameters/' | relative_url }}#version) | User-managed implementation version. |
| [`parameters`]({{ '/api/algorithms/parameters/' | relative_url }}#parameters) | JSON-serializable configuration exposed to the callable. |
| [`participate_in_fusion`]({{ '/api/algorithms/parameters/' | relative_url }}#participate_in_fusion) | Control whether predictions enter result fusion. |
| [`features`]({{ '/api/algorithms/parameters/' | relative_url }}#features) | Assign feature functions, built-in names, or a feature set. |

If `features` is omitted, the algorithm uses the [complete default feature set]({{ '/api/features/' | relative_url }}#default-feature-set). Passing feature functions directly registers them automatically.

[Open the complete registration parameter reference]({{ '/api/algorithms/parameters/' | relative_url }})

## Algorithm Types

### `unsupervised`

Use `unsupervised` for unsupervised and self-supervised methods, including models that manage their own training inside the algorithm callable.

### `supervised`

Use `supervised` for algorithms that depend on labeled data. Custom supervised algorithms currently use the default feature set only. The algorithm implementation is responsible for training and model persistence.

### `imported_model`

Use `imported_model` for a model trained outside Proffer. Imported models are inference-only from Proffer's perspective: they are not included in its training workflow and are not updated with Proffer data. Their predictions can still participate in result fusion.

## Algorithm Context

Feature-based algorithms can access prepared features and their corresponding windows:

```python
values = context.features.numpy()
scaled_values = context.features.numpy(scaled=True)
frame = context.features.dataframe()
windows = context.features.windows()
```

Raw-signal algorithms can access NumPy arrays, tensors, or windows:

```python
signal = context.raw_signal.numpy()
signal_tensor = context.raw_signal.tensor(dtype=torch.float32)
signal_windows = context.raw_signal.windows()
```

Algorithms registered with `input_type="features_and_raw"` can access both `context.features` and `context.raw_signal`.

Additional runtime information is available through `context.parameters`, `context.fs`, `context.window_size`, `context.segment_idx`, and `context.model_dir`.

## Custom Unsupervised Algorithm

Use `kind="unsupervised"` for clustering, distance-based detection, density estimation, outlier detection, and other methods that do not require labels.

```python
import numpy as np
import proffer


def robust_distance(context):
    values = context.features.numpy(scaled=True)

    if len(values) == 0:
        return np.asarray([], dtype=int)

    center = np.median(values, axis=0)
    distances = np.linalg.norm(values - center, axis=1)
    threshold = np.quantile(distances, 0.95)
    return (distances >= threshold).astype(int)


proffer.register_algorithm(
    algorithm=robust_distance,
    name="RobustDistance",
    kind="unsupervised",
    input_type="features",
    participate_in_fusion=True,
)


if __name__ == "__main__":
    proffer.run(use_default_algorithms=True)
```

## Custom Supervised Algorithm

Use `kind="supervised"` for a user-defined prediction method that depends on labeled data. A supervised callable can load a user-managed trained model and apply it to the current feature windows.

```python
from pathlib import Path

import proffer
import joblib
import numpy as np


def custom_supervised_detector(context):
    values = context.features.numpy()

    if len(values) == 0:
        return np.asarray([], dtype=int)

    model_path = (
        Path(context.model_dir)
        / f"custom_supervised_{context.window_size}.joblib"
    )

    if not model_path.is_file():
        raise FileNotFoundError(
            f"model not found: {model_path}"
        )

    model = joblib.load(model_path)
    return model.predict(values).astype(int)


proffer.register_algorithm(
    algorithm=custom_supervised_detector,
    name="CustomSupervisedDetector",
    kind="supervised",
    input_type="features",
    participate_in_fusion=True,
)
```

Proffer's automatic training workflow trains the built-in supervised algorithms. For a user-defined supervised algorithm, the user manages the labeled data, training process, model format, checkpoints, and feature compatibility. Custom supervised algorithms currently use the default proffer feature set only.

## Self-supervised Algorithm

A self-supervised method creates its training target from the input signal and does not require human labels. This example predicts the next sample from previous samples and uses prediction error as an anomaly score.

```python
import numpy as np
import proffer


def self_supervised_detector(context):
    errors = []

    for window in context.raw_signal.windows():
        signal = np.asarray(window, dtype=float).reshape(-1)

        if signal.size < 3:
            errors.append(0.0)
            continue

        inputs = signal[:-1]
        targets = signal[1:]

        coefficient, *_ = np.linalg.lstsq(
            inputs.reshape(-1, 1),
            targets,
            rcond=None,
        )

        prediction = inputs * coefficient[0]
        errors.append(np.mean((targets - prediction) ** 2))

    scores = np.asarray(errors)
    threshold = np.quantile(scores, 0.95)
    return (scores >= threshold).astype(int)


proffer.register_algorithm(
    algorithm=self_supervised_detector,
    name="SelfSupervisedDetector",
    kind="unsupervised",
    input_type="raw_signal",
    participate_in_fusion=True,
)
```

Self-supervised methods use `kind="unsupervised"` because they do not depend on labeled Proffer data.

## Trainable Deep Learning

A custom deep learning algorithm can restore a checkpoint, continue training, save its updated state, and then produce predictions. Proffer invokes the callable; the implementation manages the network, loss, optimizer, training schedule, and checkpoint format.

```python
from pathlib import Path

import proffer
import numpy as np
import torch


def trainable_deep_detector(context):
    values = context.features.numpy(scaled=True)

    if len(values) == 0:
        return np.asarray([], dtype=int)

    inputs = torch.as_tensor(values, dtype=torch.float32)

    model = MyAutoencoder(inputs.shape[1])
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    checkpoint_path = (
        Path(context.model_dir) / "custom_autoencoder.pt"
    )

    if checkpoint_path.is_file():
        checkpoint = torch.load(
            checkpoint_path,
            map_location="cpu",
            weights_only=True,
        )
        model.load_state_dict(checkpoint["model_state"])
        optimizer.load_state_dict(checkpoint["optimizer_state"])

    model.train()
    reconstruction = model(inputs)
    loss = torch.mean((reconstruction - inputs) ** 2)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    torch.save(
        {
            "model_state": model.state_dict(),
            "optimizer_state": optimizer.state_dict(),
        },
        checkpoint_path,
    )

    model.eval()
    with torch.inference_mode():
        reconstruction = model(inputs)
        scores = torch.mean(
            (reconstruction - inputs) ** 2,
            dim=1,
        )

    threshold = torch.quantile(scores, 0.95)
    return (scores >= threshold).to(torch.int64)


proffer.register_algorithm(
    algorithm=trainable_deep_detector,
    name="TrainableDeepDetector",
    kind="unsupervised",
    input_type="features",
    participate_in_fusion=True,
)
```

Training continues between calls because the algorithm explicitly restores and saves both model and optimizer state in `context.model_dir`.

## Imported Model

Use `kind="imported_model"` when a model was trained outside Proffer and should only produce predictions.

```python
from pathlib import Path

import proffer
import numpy as np
import torch


def imported_deep_detector(context):
    values = context.features.numpy(scaled=True)

    if len(values) == 0:
        return np.asarray([], dtype=int)

    inputs = torch.as_tensor(values, dtype=torch.float32)
    model_path = Path(context.parameters["model_path"])

    if not model_path.is_file():
        raise FileNotFoundError(
            f"model not found: {model_path}"
        )

    model = torch.jit.load(
        str(model_path),
        map_location="cpu",
    )
    model.requires_grad_(False)
    model.eval()

    with torch.inference_mode():
        scores = model(inputs).reshape(-1)

    if scores.numel() != inputs.shape[0]:
        raise ValueError(
            "the model must return one score per window"
        )

    threshold = float(
        context.parameters["decision_threshold"]
    )
    return (scores >= threshold).to(torch.int64)


proffer.register_algorithm(
    algorithm=imported_deep_detector,
    name="ImportedDeepDetector",
    kind="imported_model",
    input_type="features",
    participate_in_fusion=True,
    parameters={
        "model_path": "/path/to/pretrained_model.pt",
        "decision_threshold": 0.5,
    },
)
```

An imported model does not create an optimizer, call `backward()`, save updated weights, or enter the Proffer supervised training workflow. Its predictions can still participate in result fusion. The external model must use the same feature order and preprocessing as the input supplied by Proffer.

## Output

The algorithm must return one prediction for every Proffer window. Supported output types are Python lists, NumPy arrays, Pandas Series, and PyTorch tensors.

```python
return (scores >= threshold).astype(int)
```

Proffer interprets `0` as normal and `1` as anomalous. The number of returned predictions must equal the number of input windows.

## Configure Default Algorithms

Default algorithms are enabled automatically. Registered user algorithms are added to the same pipeline.

```python
proffer.run()

# Equivalent explicit configuration
proffer.run(use_default_algorithms=True)
```

Disable the complete built-in collection to run only registered user algorithms:

```python
proffer.run(use_default_algorithms=False)
```

Select or exclude algorithms by their configuration names:

```python
# Run these built-ins plus registered user algorithms.
proffer.run(
    default_algorithms=[
        "KMeans",
        "LOF",
        "RandomForest",
    ],
)

# Run all built-ins except these algorithms.
proffer.run(
    exclude_default_algorithms=[
        "GMM",
        "SVM_RBF",
    ],
)
```

`default_algorithms` and `exclude_default_algorithms` cannot be used together. Neither option may be provided when `use_default_algorithms=False`.
