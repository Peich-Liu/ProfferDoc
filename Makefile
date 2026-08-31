PORT ?= 4000

.PHONY: serve build clean

serve:
	bundle exec jekyll serve --port $(PORT)

build:
	bundle exec jekyll build

clean:
	rm -rf _site .sass-cache .jekyll-cache .codex-tmp
