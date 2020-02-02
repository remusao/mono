#!/usr/bin/env sh

set -x
set -e

if [ ! -d 'deps' ] ; then
    mkdir -v deps
fi

cd deps

if [ ! -d 'smaz' ] ; then
  wget https://registry.npmjs.org/smaz/-/smaz-1.0.0.tgz -O smaz.tgz
  tar xvf smaz.tgz
  mv package smaz
  rm smaz.tgz
fi

if [ ! -d 'shorter' ] ; then
  wget https://registry.npmjs.org/shorter/-/shorter-0.3.1.tgz -O shorter.tgz
  tar xvf shorter.tgz
  mv package shorter
  rm shorter.tgz
  cd ./shorter/ && npm install && cd ..
fi

if [ ! -d 'tiny-string' ] ; then
  wget https://registry.npmjs.org/tiny-string-js/-/tiny-string-js-1.0.2.tgz -O tiny-string.tgz
  tar xvf tiny-string.tgz
  mv package tiny-string
  rm tiny-string.tgz
fi

# NOTE: does not compile with recent version of Node.js
# https://registry.npmjs.org/smaz.js/-/smaz.js-1.0.0.tgz

# NOTE: does not work with TypeScript
# https://registry.npmjs.org/compatto/-/compatto-1.0.0.tgz
