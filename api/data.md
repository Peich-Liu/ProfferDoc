---
layout: default
title: Data API
permalink: /api/data/
description: Load external signals into Proffer.
toc:
  - title: SignalData
    url: "#proffersignaldata"
  - title: Dataloader Callable
    url: "#dataloader-callable"
---

<header class="page-header">
  <h1>Data</h1>
  <p>Normalize external signal files into the channel-first representation used by Proffer.</p>
</header>

## `proffer.SignalData`

```python
proffer.SignalData(
    data=signal,
    sampling_rate=256.0,
    channel_names=["C3", "C4"],
)
```

`data` must be finite, real, two-dimensional numeric data with shape `[channels, samples]`. The sampling rate must be positive. Channel names must be unique, non-empty, and match the channel count. If names are omitted, Proffer generates `CH1`, `CH2`, and so on.

## Dataloader Callable

A custom dataloader receives a selected file path and returns `SignalData`.

```python
def load_signal(path):
    ...
    return proffer.SignalData(
        data=samples,
        sampling_rate=fs,
        channel_names=channels,
    )


if __name__ == "__main__":
    proffer.run(dataloader=load_signal)
```

The loader's source hash contributes to dataset identity. Changing the implementation creates a distinct identity and prevents stale loaded data from being reused.
