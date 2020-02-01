# `@remusao/trie`

> A tiny but fast trie implementation for ASCII strings

## Usage

```javascript
const { create, lookup } = require('@remusao/trie');
const trie = create([
    'foo',
    'bar',
]);

lookup(trie, 'foo'); // true
lookup(trie, 'bar'); // true
lookup(trie, 'baz'); // false
```
