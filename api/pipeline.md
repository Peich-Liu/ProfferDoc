---
layout: default
title: Pipeline Configuration API
permalink: /api/pipeline/
description: Bind features, select algorithms, and configure Proffer windows.
toc:
  - title: Feature Binding
    url: "#algorithmfeature-binding"
  - title: Built-in Algorithms
    url: "#built-in-algorithms"
  - title: Window Sizes
    url: "#window-sizes"
---

<header class="page-header">
  <h1>Pipeline Configuration</h1>
  <p>Select algorithms, assign feature representations, and configure analysis windows.</p>
</header>

## Algorithm–feature Binding

```python
signal_shape = proffer.feature_set(
    name="signal_shape",
    features=[rms, "zero_crossings"],
)


if __name__ == "__main__":
    proffer.run(
        algorithm_features={
            "KMeans": signal_shape,
            "GMM": signal_shape,
        },
    )
```

Algorithms absent from `algorithm_features` retain their default feature sets. Custom algorithms can bind features during registration with `features=[...]`.

## Built-in Algorithms

The built-in collection contains `KMeans`, `GMM`, `HBOS`, `LOF`, `KNN`, `XGBoost`, `RandomForest`, `LogReg`, `SVM_RBF`, and `ExtraTrees`.

```python
proffer.run(default_algorithms=["KMeans", "GMM"])
proffer.run(exclude_default_algorithms=["LOF", "KNN"])
proffer.run(use_default_algorithms=False)
```

Use either `default_algorithms` or `exclude_default_algorithms`, not both. Set `use_default_algorithms=False` to run registered custom algorithms only.

## Window Sizes

```python
proffer.run(
    window_size=[5, 10],
    adaptive_window_sizes=True,
)
```

`window_size` accepts one positive integer or up to five distinct positive integers, in seconds. Adaptive sizing allows Proffer to introduce additional sizes in response to feedback.
