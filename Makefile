.DEFAULT_GOAL := build
.PHONY: build

SHELL := /bin/bash
PATH := $(shell yarn bin):$(PATH)

test:
	jest
.PHONY: test

test-watch:
	jest --watch

build:
	@rm -rf lib
	@tsc
	@prettier "**/*.[jt]s" --write --loglevel silent
	@node -e "require('fs').writeFileSync('./lib/package.json', JSON.stringify(Object.assign(require('./package.json'), { main: 'index.js' }), null, 2))"

publish: build
	cd lib && npm publish