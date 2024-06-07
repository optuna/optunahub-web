.PHONY: Makefile

build:
	git clone https://github.com/optuna/optunahub-registry.git || echo "optunahub-registry already exists"
	python3 hugo_build.py
	hugo --minify

start:
	hugo server --buildDrafts

clean:
	rm -rf optunahub-registry
	rm -rf public
	rm -rf content/samplers*
	rm -rf content/vizualization*
	rm -f .hugo_build.lock
