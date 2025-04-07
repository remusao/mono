# Mono

![tests](https://github.com/remusao/mono/workflows/Tests/badge.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![lgtm alerts](https://img.shields.io/lgtm/alerts/g/remusao/mono.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/remusao/mono/alerts/)
[![lgtm grade](https://img.shields.io/lgtm/grade/javascript/g/remusao/mono.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/remusao/mono/context:javascript)
[![dependabot](https://api.dependabot.com/badges/status?host=github&repo=remusao/mono)](https://dependabot.com)
![license](https://img.shields.io/github/license/remusao/mono)

## Libraries

* auto-config
* thunderbird-msg-filters
* trie

## Philosophy

This repository is also a way for me to experiment with monorepos and
how best to organize them. I have been trying out many different tools
or "stacks" in the past and have stabilized on the following:

* All code is written in TypeScript targeting ES6.
* Eslint is used for linting code.
* Lerna is used for version management and publishing (used by `auto`).
* Yarn workspaces are used to share a lock file and `node_modules` folder.
* Auto is used for continuous publishing of the libraries (using Lerna).
* Each package contains its own package.json and dependencies.
* Each package can be built independently.
* Composite and incremental modes of TypeScript are leveraged for fast compilation.
* Each package exposes commonjs and es6 entry points, built with `tsc`.
* Tests are written in TypeScript and compiled like library code.
* Mocha is used to launch tests.
* Chai is used for test assertions.

There is currently no bundling or minification performed on published
packages, but this will be done in the future using Rollup will be used.

Other thoughts:

* No babel is used, tsc is more than capable of producing build output.
* Dev/normal mode produces commonjs bundles, which can be used in watch
  mode to iterate faster, run tests, load library locally in Node.js.
* Bundle mode produces extra es6 artifacts, which only happens in CI so
  it's fine if it takes a bit more time. ES6 output is also created using
  tsc.
* Packages names are namespaced with the name of the GitHub account @remusao to
  prevent any naming collision (e.g. 'trie' package would have to be renamed)
  and provide some kind of consistency. Also, experience shows that fancy
  package names tend to be misunderstood and harder to discover.
* As long as both commonjs and es6 modules will have to co-exist in the Node.js
  ecosystem, there will be extra complication for package maintainers. Ideally
  only es6 would be required, which would simplify building and bundling code.
  I expect a migration of the repository to 100% ES6 modules before end of 2020
  when all tooling is compatible (e.g. mocha is currently adding first-class
  support for ES6 modules).
