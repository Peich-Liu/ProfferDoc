---
layout: default
title: Proffer
permalink: /
description: Documentation companion site for the Proffer academic paper/project and signal artefact annotation workflow.
scroller: true
toc:
  - title: Overview
    url: "#overview"
  - title: Workflow
    url: "#workflow"
  - title: Getting Started
    url: "#getting-started"
  - title: Tutorials
    url: "#tutorials"
  - title: API Reference
    url: "#api-reference"
  - title: Citation
    url: "#citation"
  - title: Support
    url: "#support"
---

<section class="scroller-section hero-section" id="overview" markdown="1">
<header class="page-header hero-header">
  <!-- <p class="eyebrow">Paper companion and workflow documentation</p> -->
  <h1>Proffer</h1>
  <p>Faster and better signal artefact annotation with a human-in-the-loop algorithm workflow.</p>
</header>

<div class="hero-actions">
  <a class="button primary" href="#getting-started">Get started</a>
  <a class="button" href="{{ '/tutorials/' | relative_url }}">Watch tutorial</a>
  <a class="button ghost" href="https://github.com/benjaminhervit/benjaminhervit.github.io">GitHub</a>
</div>

<figure class="overview hero-figure">
  <img src="{{ '/assets/images/overview.png' | relative_url }}" alt="Overview of the Proffer annotation workflow">
  <figcaption>PEICHEN: Overview of the Proffer documentation and annotation workflow. Replace this caption with the final paper figure caption when available.</figcaption>
</figure>
</section>

<section class="scroller-section" id="workflow" markdown="1">
## Annotation Workflow

AnnoProg is a progressive signal artefact annotation tool that improves artefact annotation efficiency. The tool presents the user with artefact detections based on cross-algorithmic predictions, which continuously improve throughout the session through a human-in-the-loop workflow.

Algorithmic suggestions and human reviews are incorporated into existing annotation GUI and UX workflows. The goal is to let reviewers use the progressive workflow without disrupting familiar annotation practices.

<div class="workflow-steps">
  <article>
    <span>1</span>
    <h3>Surface candidates</h3>
    <p>Use cross-algorithmic predictions to propose signal segments that are likely to contain artefacts.</p>
  </article>
  <article>
    <span>2</span>
    <h3>Review in context</h3>
    <p>Keep the human reviewer inside the familiar annotation interface while prioritizing high-value decisions.</p>
  </article>
  <article>
    <span>3</span>
    <h3>Improve progressively</h3>
    <p>Feed reviewer decisions back into the workflow so the remaining suggestions become more useful over time.</p>
  </article>
</div>
</section>

<section class="scroller-section" id="getting-started" markdown="1">
## Getting Started

Use the dedicated installation page for the canonical setup path, then return here for the paper companion material.

```bash
python -m pip install proffer
```

<div class="link-list">
  <a href="{{ '/installation/' | relative_url }}">
    <strong>Installation</strong>
    <span>Install the package and verify your environment.</span>
  </a>
  <a href="{{ '/api/' | relative_url }}">
    <strong>API Reference</strong>
    <span>Browse public modules, classes, functions, and integration points.</span>
  </a>
</div>
</section>

<section class="scroller-section" id="tutorials" markdown="1">
## Tutorials

Start with the walkthrough video to see the annotation interface, file import flow, and segment completion workflow in context.

<div class="video-grid">
  <article class="video-card">
    <h3>Quickstart Walkthrough</h3>
    <p>Introduce the interface, load a sample signal, review suggested artefacts, and export results.</p>
    <div class="video-wrapper">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Proffer quickstart walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
  </article>
</div>

<p><a class="button" href="{{ '/tutorials/' | relative_url }}">Open tutorial page</a></p>
</section>

<section class="scroller-section" id="api-reference" markdown="1">
## API Reference

The API page is the entry point for public classes, functions, modules, command-line tools, and integration points.
{% include api_overview.html %}
<p><a class="button" href="{{ '/api/' | relative_url }}">Open API reference</a></p>
</section>

<section class="scroller-section" id="citation" markdown="1">
## Citation

If this project supports your work, please cite the associated paper, software release, or archival DOI.

{% include citation.html %}

<p><a class="button" href="{{ '/citation/' | relative_url }}">Citation details</a></p>
</section>

<section class="scroller-section" id="support" markdown="1">
## Support

Project support, acknowledgements, funding information, and reviewer-facing contact details have not been finalized yet. Add the final project links before publishing the site as a paper companion.

<div class="link-list">
  <a href="{{ '/about/' | relative_url }}">
    <strong>About the project</strong>
    <span>Background, stewardship, maintainers, and project links.</span>
  </a>
  <a href="https://github.com/benjaminhervit/benjaminhervit.github.io/issues">
    <strong>Get help</strong>
    <span>Ask questions, report issues, and help improve the documentation.</span>
  </a>
</div>
</section>
