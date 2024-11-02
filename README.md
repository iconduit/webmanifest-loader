# Iconduit web app manifest loader

_A Webpack loader for `.webmanifest` files_

[![Current NPM version][badge-npm-version-image]][badge-npm-version-link]
[![Build status][badge-build-image]][badge-build-link]
[![Test coverage][badge-coverage-image]][badge-coverage-link]

[badge-build-image]:
  https://img.shields.io/github/actions/workflow/status/iconduit/webmanifest-loader/ci-library.yml?branch=main&style=for-the-badge
[badge-build-link]:
  https://github.com/iconduit/webmanifest-loader/actions/workflows/ci-library.yml
[badge-coverage-image]:
  https://img.shields.io/codecov/c/gh/iconduit/webmanifest-loader?style=for-the-badge
[badge-coverage-link]: https://codecov.io/gh/iconduit/webmanifest-loader
[badge-npm-version-image]:
  https://img.shields.io/npm/v/%40iconduit%2Fwebmanifest-loader?label=%40iconduit%2Fwebmanifest-loader&logo=npm&style=for-the-badge
[badge-npm-version-link]: https://npmjs.com/package/@iconduit/webmanifest-loader

This loader processes [web app manifest] files, adding any images to the bundle
and resolving their URLs in the output manifest file.

[web app manifest]: https://developer.mozilla.org/docs/Web/Manifest

It supports:

- Resolving [icons]
- Resolving [shortcut icons]
- Resolving [screenshots]

[icons]: https://w3.org/TR/appmanifest/#icons-member
[shortcut icons]: https://w3.org/TR/appmanifest/#icons-member-0
[screenshots]: https://w3.org/TR/manifest-app-info/#screenshots-member

## Usage

```js
// webpack.config.js
export default {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /(\.webmanifest|\/manifest\.json)$/i,
        type: "asset/resource",
        use: "@iconduit/webmanifest-loader",
      },
    ],
  },
};
```
