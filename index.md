---
layout: default
title: Proffer
permalink: /
description: Documentation companion site for the Proffer academic paper/project and signal artefact annotation workflow.
scroller: true
toc:
  - title: Overview
    url: "#overview"
  - title: Quick Start
    url: "#quick-start"
  - title: Proffer Walkthrough
    url: "#video-tutorial"
---

<section class="scroller-section hero-section" id="overview" markdown="1">
<header class="page-header hero-header">
  <!-- <p class="eyebrow">Paper companion and workflow documentation</p> -->
  <h1>Proffer</h1>
  <p>A Progressive Visual Analytics Framework for Artifact Annotation in Long-Term Biological Signals</p>
</header>

<figure class="overview hero-figure">
  <img src="{{ '/assets/images/Overview.png' | relative_url }}" alt="Overview of the Proffer annotation workflow">
  <figcaption>Overview of the Proffer human-in-the-loop workflow for efficient signal artefact annotation.</figcaption>
</figure>
</section>

<section class="scroller-section" id="quick-start" markdown="1">
## Quick Start

Use the dedicated installation page for the canonical setup path, then return here for the paper companion material.

```bash
python -m pip install proffer
```

<div class="link-list">
  <a href="{{ '/installation/' | relative_url }}">
    <strong>Installation</strong>
    <span class="link-description">Set up Proffer and verify your environment.</span>
    <span class="link-action">View installation details <span aria-hidden="true">→</span></span>
  </a>
  <a href="{{ '/api/' | relative_url }}">
    <strong>Reference Guide</strong>
    <span class="link-description">Explore modules, classes, functions, and integration points.</span>
    <span class="link-action">View reference details <span aria-hidden="true">→</span></span>
  </a>
</div>
</section>

<section class="scroller-section" id="video-tutorial" markdown="1">
## Proffer Walkthrough

<div class="video-grid">
  <div class="video-wrapper">
    <video controls preload="metadata" playsinline aria-label="Proffer quickstart walkthrough">
      <source src="{{ '/assets/video/Basic Intro.mp4' | relative_url }}" type="video/mp4">
      Your browser does not support HTML video.
    </video>
  </div>
</div>

<p><a class="button" href="{{ '/tutorials/' | relative_url }}">Open tutorial page</a></p>
</section>
