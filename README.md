# yaml-templater

```
Usage: yaml-templater [--apply-array] [--data data.yaml] <main yaml> <yaml templates>
```

## Install

```
yarn add -D @farport/yaml-templater
```

This should create a `.bin/yaml-templater` executable in your `node_modules`.

## Test Run

To do a test run, do:

```bash
# Show Help
yarn cli --help

# The result should be test/data/config-merged.yaml
FP8PROJKEY=TKuNFwIosI yarn cli --data test/data/data.yaml test/data/config-a.yaml test/data/config-b.template.yaml
```
