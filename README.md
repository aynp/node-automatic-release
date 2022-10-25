# Node Automatic Release

Automatically generate a new release for your node project when the version in your `package.json` changes.

**Marketplace Link - [node-automatic-release](https://github.com/marketplace/actions/node-automatic-release)**

## Usage

Here is a sample workflow -

```yaml
name: Automatic Release

on:
  # When a change is pushed to package.json in main branch
  push:
    branches: ['main']
    paths: ['package.json']
  # Manual run
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Required to access package.json
      - name: Checkout
        uses: actions/checkout@v3

      - name: Update Release
        uses: aynp/node-automatic-release@v1.1.0
        with:
          draft_release: false
          generate_release_notes: true
```

## Inputs

- `draft_release` - `true` to create a draft (unpublished) release, `false` to create a published one

- `generate_release_notes` - `true` to generate release notes from the commit messages, `false` otherwise.

## Publishing to NPM

This action works seamlessly with [Publishing packages to the npm registry](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages#publishing-packages-to-the-npm-registry) guide or the default `Publish Node.js Package` workflow template by GitHub.

Both these workflows run after a new release is created.

You can use either of the two workflows above in addition to this one to seamlessly publish your package to NPM whenever `package.json` version changes.
