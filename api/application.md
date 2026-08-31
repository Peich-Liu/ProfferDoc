---
layout: default
title: Application API
permalink: /api/application/
description: Launch and configure the Proffer application.
toc:
  - title: proffer.run
    url: "#profferrun"
  - title: Parameters
    url: "#parameters"
  - title: Example
    url: "#example"
---

<header class="page-header">
  <h1>Application</h1>
  <p>Launch Proffer and configure the workspace and processing pipeline.</p>
</header>

## `proffer.run()`

`proffer.run()` starts the Proffer interface. Put the call behind a main guard so worker processes can safely import custom functions.

```python
import proffer


if __name__ == "__main__":
    proffer.run()
```

With no arguments, Proffer uses its built-in dataloader, default features and algorithms, a 10-second window, and a `workspace` directory beside the startup script.

## Parameters

| Parameter | Description |
| --- | --- |
| `prefer_exe` | Prefer the packaged backend executable when available. |
| `workspace` | Workspace directory. |
| `window_size` | A positive integer or a list of up to five distinct positive integers, in seconds. |
| `adaptive_window_sizes` | Allow feedback to introduce additional window sizes. |
| `use_default_algorithms` | Enable the built-in algorithm collection. |
| `default_algorithms` | Run only the named built-in algorithms. |
| `exclude_default_algorithms` | Omit the named built-in algorithms. |
| `algorithm_features` | Map algorithm names to feature sets. |
| `dataloader` | Module-level function used to load a selected signal file. |

`default_algorithms` and `exclude_default_algorithms` are mutually exclusive.

## Example

```python
if __name__ == "__main__":
    proffer.run(
        prefer_exe=False,
        workspace="./my_workspace",
        window_size=[5, 10],
        adaptive_window_sizes=True,
    )
```
