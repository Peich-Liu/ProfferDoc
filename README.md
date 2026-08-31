# Proffer Documentation Site

This repository contains the GitHub Pages documentation companion site for the Proffer academic paper/project.

## Local Development

Use Ruby 3.0 or newer. The default macOS system Ruby 2.6 is too old for the current GitHub Pages dependency stack.

Install the GitHub Pages-compatible Jekyll dependencies:

```bash
bundle install
```

Run the site locally:

```bash
bundle exec jekyll serve
```

Then open the local URL printed by Jekyll, usually `http://127.0.0.1:4000`.

Build the site without serving it:

```bash
bundle exec jekyll build
```

## Deployment

The site is intended to deploy automatically through GitHub Pages after changes are pushed to the `main` branch.

Do not add `.nojekyll`; this project relies on Jekyll processing for layouts, includes, Markdown pages, and `relative_url` links.

## Content Notes

- Public pages live in Markdown files at the repository root.
- Shared layout lives in `_layouts/default.html`.
- Navigation and footer markup live in `_includes/`.
- CSS lives in `assets/css/style.css`.
- Images and other static files stay under `assets/`.
- Tutorial videos should be embedded from external services such as YouTube or Vimeo rather than committed as large video files.

## Remaining Metadata To Add

- Final paper title, authors, and citation metadata.
- Final package name and source-code repository URL if different from this documentation repository.
- Real tutorial video URLs.
- Final project support, acknowledgements, and contact details.
