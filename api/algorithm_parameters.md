---
layout: default
title: Algorithm Registration Parameters
permalink: /api/algorithms/parameters/
description: Detailed reference for every proffer.register_algorithm parameter.
toc:
  - title: algorithm
    url: "#algorithm"
  - title: name
    url: "#name"
  - title: input_type
    url: "#input_type"
  - title: kind
    url: "#kind"
  - title: version
    url: "#version"
  - title: parameters
    url: "#parameters"
  - title: participate_in_fusion
    url: "#participate_in_fusion"
  - title: features
    url: "#features"
---

<header class="page-header">
  <h1>Algorithm Registration Parameters</h1>
  <p>Detailed reference for every option accepted by <code>proffer.register_algorithm()</code>.</p>
</header>

```python
proffer.register_algorithm(
    algorithm=my_algorithm,
    name="MyAlgorithm",
    input_type="features",
    kind="unsupervised",
    version="1",
    parameters={},
    participate_in_fusion=True,
    features=None,
)
```

## `algorithm`

The Python function that implements the detector. It receives an Algorithm Context and must return one prediction for every input window.

The function must be named and defined at module level so proffer worker processes can import it. Lambdas and nested functions are not supported.

```python
def my_algorithm(context):
    values = context.features.numpy(scaled=True)
    return detect(values)
```

## `name`

The name used to identify the algorithm in proffer. If `name` is omitted, proffer uses the function name.

Use a stable, descriptive name when run history, configuration, or model files need to refer to the same algorithm consistently.

```python
name="RobustDistance"
```

## `input_type`

Determines which prepared input interfaces are available to the algorithm callable.

| Value | Available interface | Typical use |
| --- | --- | --- |
| `features` | `context.features` | Classical machine learning, clustering, and detectors based on engineered features. |
| `raw_signal` | `context.raw_signal` | Signal-processing methods, end-to-end neural networks, and self-supervised methods. |
| `features_and_raw` | Both interfaces | Hybrid methods that combine feature vectors with their corresponding raw windows. |

Feature input provides:

```python
values = context.features.numpy()
scaled_values = context.features.numpy(scaled=True)
frame = context.features.dataframe()
windows = context.features.windows()
```

Raw-signal input provides:

```python
signal = context.raw_signal.numpy()
tensor = context.raw_signal.tensor(dtype=torch.float32)
windows = context.raw_signal.windows()
```

With `features_and_raw`, both interfaces describe the same algorithm call and can be used together. Regardless of input type, the callable must return one prediction per Proffer window.

## `kind`

Describes how the algorithm is used and who manages its training lifecycle.

| Value | Behavior |
| --- | --- |
| `unsupervised` | For clustering, outlier detection, self-supervised methods, and algorithms that manage their own training without labeled Proffer data. |
| `supervised` | For prediction methods that depend on labels. User-defined implementations manage their own labeled data, training, model format, and persistence. |
| `imported_model` | For externally trained, inference-only models. Proffer loads and runs the model but does not train or update it. |

Custom supervised algorithms currently use the complete default Proffer feature set. An imported model may still participate in result fusion.

## `version`

A user-managed identifier for the algorithm implementation, such as `"1"` or `"2.1"`.

Update the value when you want the registration metadata to distinguish a revised implementation or model contract. Keep it stable when the implementation remains compatible.

```python
version="2"
```

## `parameters`

Configuration values made available as `context.parameters`. Values must be JSON-serializable so they can be transferred to worker processes.

```python
parameters={
    "model_path": "/path/to/pretrained_model.pt",
    "decision_threshold": 0.5,
}
```

Read them inside the callable:

```python
model_path = context.parameters["model_path"]
threshold = float(context.parameters["decision_threshold"])
```

Use parameters for configuration, not for live model objects, open files, tensors, or other process-local state.

## `participate_in_fusion`

Controls whether the algorithm's predictions are included when Proffer fuses results from multiple algorithms.

```python
participate_in_fusion=True
```

Set it to `False` when the algorithm should run and expose its own predictions without contributing to the fused result.

## `features`

Selects the feature representation assigned to the algorithm. The value can contain custom feature functions, built-in feature names, or a named feature set.

```python
features=[
    rms,
    "zero_crossings",
]
```

You can also provide a reusable feature set:

```python
signal_shape = proffer.feature_set(
    name="signal_shape",
    features=[rms, "zero_crossings"],
)

proffer.register_algorithm(
    algorithm=my_algorithm,
    features=signal_shape,
)
```

If `features` is omitted, Proffer supplies the [complete default feature set]({{ '/api/features/' | relative_url }}#default-feature-set). Custom feature functions passed here are registered automatically. Custom supervised algorithms currently support only the default feature set.

<div class="notice">
  <strong>Related reference:</strong> return to <a href="{{ '/api/algorithms/' | relative_url }}">Algorithms</a> for complete registration and implementation examples.
</div>
