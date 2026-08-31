---
layout: default
title: Runtime Contexts API
permalink: /api/contexts/
description: Inputs and metadata exposed to Proffer features and algorithms.
toc:
  - title: Feature Context
    url: "#feature-context"
  - title: Algorithm Context
    url: "#algorithm-context"
  - title: Extension Requirements
    url: "#extension-requirements"
---

<header class="page-header">
  <h1>Runtime Contexts</h1>
  <p>Access prepared inputs and processing metadata without relying on global state.</p>
</header>

## Feature Context

Feature callables can accept the context as an optional second argument.

| Attribute | Description |
| --- | --- |
| `fs` | Sampling rate. |
| `channel` | Current channel. |
| `segment_idx` | Segment index. |
| `window_size` | Active window size. |
| `window_start`, `window_end` | Window boundaries in samples. |
| `start_time`, `end_time` | Window boundaries in time. |
| `parameters` | Feature parameters. |
| `metadata` | Additional processing metadata. |

## Algorithm Context

| Interface | Description |
| --- | --- |
| `context.features.dataframe()` | Window metadata and feature columns as a DataFrame. |
| `context.features.numpy()` | Feature matrix as a NumPy array. |
| `context.features.numpy(scaled=True)` | Standardized feature matrix. |
| `context.raw_signal.numpy()` | Raw signal as a NumPy array. |
| `context.raw_signal.windows()` | Raw signal windows. |
| `context.raw_signal.tensor()` | Raw signal as a tensor. |
| `context.windows()` | Windows associated with the algorithm call. |

The algorithm context also exposes `parameters`, `fs`, `window_size`, `segment_idx`, and `model_dir`.

## Extension Requirements

Custom callables must be named functions defined at module level. Lambdas and nested functions cannot be imported by worker processes. Place `proffer.run()` inside `if __name__ == "__main__":`.
