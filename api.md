---
layout: default
title: API Reference
permalink: /api/
description: Public Python interfaces for extending and configuring Proffer.
---

<header class="page-header">
  <h1>API Reference</h1>
  <p>Public Python interfaces for launching Proffer and extending its signal-processing pipeline.</p>
</header>

Proffer exposes a compact functional API. Select a section to view its interfaces, requirements, and focused examples.

{% include api_overview.html %}

<div class="notice">
  <strong>Extension model:</strong> define a module-level function, pass or register it, then run Proffer. Decorators and JSON registration files are not required.
</div>
