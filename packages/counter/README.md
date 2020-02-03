# `@remusao/counter`

> A simpler counter implementation inspired by Python's Counter

## Usage

```javascript
const { Counter } = require('@remusao/counter');
const counter = new Counter([
  ['foo', 2],
  ['bar', 1],
]); // optional init

counter.has('foo'); // true
counter.get('foo'); // 2

counter.has('baz'); // false
counter.get('baz'); // 0
counter.incr('baz');
counter.has('baz'); // true
counter.get('baz'); // 1
counter.decr('baz');
counter.has('baz'); // false
counter.get('baz'); // 0
```
