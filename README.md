# OTIO core model specification

## Overview

This repository contains the OTIO core model specification and the [node](https://nodejs.org) scripts necessary to generate:

* an HTML representation of the specification
* a [JSON Schema](https://json-schema.org/) for the [JSON](https://json.org) serialization defined by the specification.

## Architecture

The specification is contained in a single markdown document (`src/main/md/otio-core.md`) that combines:

* specification prose
* figures (rendered figures are stored under `figures` while corresponding source files are under `src/main/resources`)
* inline UML diagrams that conform to the [PlantUML](https://plantuml.com/) syntax
* inline [JSON Schema](https://json-schema.org/) snippets

Combining these elements into a single document prevents divergence between prose, data model representation and JSON serialization.

The specification is built using [node](https://nodejs.org) scripts as follows:

* `script/build.js`: the markdown document, including the inline UML diagrams, is rendered to HTML, and the inline JSON schema snippets are extracted and combined into a standalone document. The latter steps uses the [handlebar template](https://handlebarsjs.com/) at `src/main/templates/otio.schema.hbs`
* `script/test.js`: the standalone JSON schema document is tested against a collection of sample files at `src/test/json`

## Prerequisites

* [node](https://nodejs.org)
* [Graphviz](https://graphviz.org/)

## Quickstart

* Install node dependencies:

`npm install`

* Run the build script to generate the rendered specification:

`npm run build`

## Build artifacts

The rendered specification consists of the following files under the `build` directory:

* `index.html`: the specification, which embeds all figures and rendered UML diagrams
* `otio.schema.json`: the JSON schema document

## Repository layout

* `figures`: rendered figures used by the specification
* `scripts`: build and test scripts
* `src/main/md/otio-core.md`: source specification
* `src/main/resources/*.vsd`: source files for the specification figures
* `src/main/templates/otio.schema.hbs`: template used to generate the JSON schema document
* `src/test/json`: sample OTIO documents used to test the generated JSON schema
* `package.json` and `package-lock.json`: NPM dependency specifications
