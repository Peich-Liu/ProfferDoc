---
layout: default
title: Installation
permalink: /installation/
description: Installation and environment setup instructions for Proffer.
toc:
  - title: Requirements
    url: "#requirements"
  - title: Install with pip
    url: "#install-with-pip"
  - title: Install with conda
    url: "#install-with-conda"
  - title: Install from source
    url: "#install-from-source"
  - title: Verify the Installation
    url: "#verify-the-installation"
---

<header class="page-header">
  <h1>Installation</h1>
  <p>This page gives users the shortest reliable path to a working Proffer environment.</p>
</header>

## Requirements

- Python 3.10+
- A terminal with access to your preferred package manager
- Optional: a virtual environment for isolated installs

## Install with pip

Replace the package name below with the final published package name if it differs from `proffer`.

```bash
python -m pip install proffer
```

## Install with conda

If a conda package is published, document the canonical channel here.

```bash
conda install -c conda-forge proffer
```

## Install from source

Replace `SOURCE_REPOSITORY_URL` with the final source-code repository before publishing these instructions.

```bash
git clone SOURCE_REPOSITORY_URL
cd proffer
python -m pip install -e .
```

## Verify the Installation

```bash
python -c "import proffer; print(proffer.__version__)"
```

If the project is distributed under a different import name, update this verification command before publishing.
