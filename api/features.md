---
layout: default
title: Features API
permalink: /api/features/
description: Define features and reusable Proffer feature sets.
toc:
  - title: Default Feature Set
    url: "#default-feature-set"
  - title: Using Default Features
    url: "#using-default-features"
  - title: Feature Callable
    url: "#feature-callable"
  - title: feature_set
    url: "#profferfeature_set"
  - title: available_features
    url: "#profferavailable_features"
---

<header class="page-header">
  <h1>Features</h1>
  <p>Transform signal windows into numeric values used by detection algorithms.</p>
</header>

## Default Feature Set

When an algorithm uses `input_type="features"` and does not specify a separate feature configuration, Proffer extracts the complete default feature set automatically. Features are calculated independently for each signal window and channel, then exposed through `context.features`.

```python
values = context.features.numpy()
scaled_values = context.features.numpy(scaled=True)
frame = context.features.dataframe()
```

The default set contains eight features:

| Feature | Category | Definition |
| --- | --- | --- |
| `petrosian_fd` | Complexity | Petrosian fractal dimension. It summarizes signal complexity from sign changes in the first derivative. |
| `higuchi_fd` | Complexity | Higuchi fractal dimension. It estimates curve complexity across multiple temporal scales; the current default implementation uses a maximum scale of 10. |
| `alpha_delta_ratio` | Frequency content | Alpha-band power divided by delta-band power. Power is estimated with Welch's method using 8-15 Hz for alpha and 0-3 Hz for delta. |
| `n_bursts` | Burst activity | Number of continuous sample sequences above the window mean plus two standard deviations. |
| `burst_len_mean` | Burst activity | Mean detected burst duration in seconds. Returns `0` when no bursts are detected. |
| `burst_len_std` | Burst activity | Standard deviation of detected burst durations in seconds. Returns `0` when no bursts are detected. |
| `zero_crossings` | Signal transitions | Number of sign changes within the window, providing a simple measure of oscillation and rapid temporal variation. |
| `n_spikes` | Extreme amplitudes | Number of samples whose absolute deviation from the window mean exceeds three standard deviations. |

## Using Default Features

Omitting `features` from a feature-based algorithm registration selects the complete default set:

```python
proffer.register_algorithm(
    algorithm=my_detector,
    name="MyDetector",
    kind="unsupervised",
    input_type="features",
)
```

The callable receives a feature row for each Proffer signal window:

```python
def my_detector(context):
    values = context.features.numpy(scaled=True)
    predictions = run_detection(values)
    return predictions
```

Input type determines whether the default matrix is available:

| `input_type` | Default feature matrix | Raw signal input |
| --- | --- | --- |
| `features` | Available through `context.features` | Not provided |
| `raw_signal` | Not provided | Available through `context.raw_signal` |
| `features_and_raw` | Available through `context.features` | Available through `context.raw_signal` |

A combined algorithm can use both representations:

```python
def combined_detector(context):
    feature_values = context.features.numpy(scaled=True)
    signal_windows = context.raw_signal.windows()

    return run_combined_detection(
        feature_values,
        signal_windows,
    )
```

## Feature Callable

A feature accepts one signal window and returns either one number or a dictionary of named numbers.

```python
def rms(signal):
    values = np.asarray(signal, dtype=float)
    return float(np.sqrt(np.mean(np.square(values))))
```

Add a context argument when the calculation needs sampling or window metadata:

```python
def spectral_feature(signal, context):
    return calculate_spectrum(signal, fs=context.fs)
```

A function named `amplitude` returning `{"mean": ..., "maximum": ...}` produces the columns `amplitude__mean` and `amplitude__maximum`.

## `proffer.feature_set()`

```python
signal_shape = proffer.feature_set(
    name="signal_shape",
    features=[
        rms,
        "zero_crossings",
    ],
)
```

Feature sets can combine module-level functions with built-in feature names. Passing a custom function registers it automatically.

## `proffer.available_features()`

```python
print(proffer.available_features())
```

Use `available_features()` as the authoritative list for the installed version. The default set is documented in [Default Feature Set](#default-feature-set).
