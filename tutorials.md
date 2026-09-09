---
layout: default
title: Tutorials
permalink: /tutorials/
description: Proffer walkthrough and chapter-based tutorials.
toc:
  - title: Proffer Walkthrough
    url: "#proffer-walkthrough"
  - title: Your First Annotation Session
    url: "#your-first-annotation-session"
  - title: Customizing Proffer
    url: "#customizing-proffer"
---

<header class="page-header">
  <h1>Tutorials</h1>
</header>

## Proffer Walkthrough

<div class="video-grid">
  <div class="video-wrapper">
    <video controls preload="metadata" playsinline aria-label="Proffer walkthrough">
      <source src="{{ '/assets/video/Basic Intro.mp4' | relative_url }}" type="video/mp4">
      Your browser does not support HTML video.
    </video>
  </div>
</div>

## Your First Annotation Session
This tutorial guides you through opening a recording, reviewing artifact suggestions, and submitting your first segment in Proffer.
### Open a recording
You can select a recording in two ways: specify its file path in your [Python startup script]({{ '/api/application/' | relative_url }}#profferrun), or launch Proffer and select the file through the interface.
Import Proffer in the script with `import proffer`.
Once the recording is loaded, check the channel names, sampling rate, and recording duration in the metadata panel. The overview shows your position in the recording, while the detailed view displays the signal and artifact annotations.
<figure>
  <img src="{{ '/assets/images/tutorials/chapter-1/open-recording.png' | relative_url }}" alt="Selecting a recording and starting annotation in Proffer" width="100%">
  <figcaption>Select a recording, then start annotation.</figcaption>
</figure>

### Review a segment
You can follow the recommended segment order to help Proffer make use of your feedback as you review. Submitting each reviewed segment allows that feedback to inform subsequent predictions. You are also free to explore other parts of the recording. Use the Segment Control Panel to navigate to the recommended segment. 
<figure>
  <img src="{{ '/assets/images/tutorials/chapter-1/review-segment.png' | relative_url }}" alt="Reviewing a signal segment in Proffer" width="100%">
  <figcaption>Review the selected signal segment.</figcaption>
</figure>

### Check and apply
Once all suggestions have been resolved, the segment becomes review-ready. Inspect the entire segment for missed artifacts before continuing.
When your review is complete, click Apply in the segment-review panel. This applies your reviewed annotations as reference data for subsequent model updates and marks the segment as completed.
<figure>
  <img src="{{ '/assets/images/tutorials/chapter-1/check-and-apply.png' | relative_url }}" alt="A reviewed segment and the Apply button" width="100%">
  <figcaption>Apply the completed segment review.</figcaption>
</figure>

As you continue, Proffer uses feedback from previously submitted segments to refine subsequent suggestions. You can follow the recommended order to continue reviewing with this updated algorithmic support:
Review suggestions → check for missed artifacts → submit.
You have now completed your first annotation cycle and provided feedback to support the next stage of analysis.


### Understanding annotation states

Proffer uses three annotation states to help you track your review:
- Suggestion: An algorithm-generated region awaiting your review.
- Approved: An annotation you have accepted, adjusted, or added, but have not yet submitted.
- Confirmed: An annotation submitted as reference data for subsequent model updates.

<figure>
  <img src="{{ '/assets/images/tutorials/chapter-1/annotation-states-legend.png' | relative_url }}" alt="Suggestion, Approved, and Confirmed annotation states" width="100%">
  <figcaption>The three annotation states.</figcaption>
</figure>

<figure>
  <img src="{{ '/assets/images/tutorials/chapter-1/annotation-states-example.png' | relative_url }}" alt="Annotation states displayed on signal channels" width="100%">
  <figcaption>Annotation states in the signal view.</figcaption>
</figure>



## Customizing Proffer

You can adapt Proffer to your own data and detection methods through its Python interfaces. Choose the sections below that match your needs; each links to examples and detailed API instructions.

### Load your own data

If your recording requires a custom reader, define a dataloader that receives a file path and returns `proffer.SignalData`. Organize the signal as `[channels, samples]` and provide its sampling rate and channel names.

Pass your loader to `proffer.run()` using the `dataloader` parameter. Open a recording and check that the channels, duration, and waveforms appear as expected before starting your review.

See the [Data API]({{ '/api/data/' | relative_url }}) for the loader example and input requirements.

### Add custom features

To describe signal characteristics relevant to your task, define a feature function that accepts one signal window and returns a number or a dictionary of named numbers.

You can combine your functions with built-in features using `proffer.feature_set()`, then assign the feature set to an algorithm. Algorithms without a custom feature configuration retain their default features.

See the [Features API]({{ '/api/features/' | relative_url }}) for examples and [Pipeline Configuration]({{ '/api/pipeline/' | relative_url }}) for assigning features to algorithms.

### Add a custom algorithm

To use your own detector, define a function that receives a Proffer algorithm context. Your detector can work with extracted features, raw signals, or both.

Return one prediction per analysis window: `0` for normal and `1` for anomalous. Register the function with `proffer.register_algorithm()`, selecting its input type and whether its predictions should participate in fusion.

Your detector can run alongside the built-in algorithms, or you can disable them to run only your registered methods.

See the [Algorithms API]({{ '/api/algorithms/' | relative_url }}) for examples and the [Registration Parameters]({{ '/api/algorithms/parameters/' | relative_url }}) for configuration details.

### Use an existing model

If you already have a trained model, register it with `kind="imported_model"`. Ensure that its input preparation matches the features, ordering, and preprocessing used during training.

Imported models provide predictions and can participate in fusion, but Proffer does not retrain them. For custom supervised algorithms, you manage training and model persistence yourself. Custom supervised algorithms currently use the default Proffer feature set only.

See the [Imported Model example]({{ '/api/algorithms/' | relative_url }}#imported-model) and the [Custom Supervised Algorithm example]({{ '/api/algorithms/' | relative_url }}#custom-supervised-algorithm) for implementation details.

### Run your customized workflow

Define custom functions at module level and place the `proffer.run()` call inside an `if __name__ == "__main__":` guard so worker processes can load them correctly.

Start with a short recording to check your data loading and prediction outputs. Once configured, follow the same annotation workflow:

**Review suggestions → check for missed artifacts → Apply.**

See the [Application API]({{ '/api/application/' | relative_url }}) for startup options and [Runtime Contexts]({{ '/api/contexts/' | relative_url }}) for the inputs available to custom functions.
