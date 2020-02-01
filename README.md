# Mono

![tests](https://github.com/remusao/mono/workflows/Tests/badge.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![lgtm alerts](https://img.shields.io/lgtm/alerts/g/remusao/mono.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/remusao/mono/alerts/)
[![lgtm grade](https://img.shields.io/lgtm/grade/javascript/g/remusao/mono.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/remusao/mono/context:javascript)
[![dependabot](https://api.dependabot.com/badges/status?host=github&repo=remusao/mono)](https://dependabot.com)
![license](https://img.shields.io/github/license/remusao/mono)

## Libraries

* tsmaz
* tsmaz-compress
* tsmaz-decompress
* tsmaz-generate

## Stack

This repository is also a way for me to experiment with different ways to manage
a monorepo of JavaScript libraries. The following tools are currently used:

* TypeScript (producing es6 and cjs output using `tsc`)
* Jest with `ts-jest` to run unit tests
* Tslint for code linting (I still did not migrate to eslint)
* Yarn workspaces
* Lerna for publishing and versions management

There is currently no bundling or minification performed on published packages,
but if this is done in the future, rollup will be used.
