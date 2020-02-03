# `@remusao/smaz-generate`

> Generate optimized codebooks from data to use in smaz compression

Smaz comes with a default codebook which was optimized for some kind
of data. It works well for English text, URLs and HTML. It's also
non-optimal for all of these and might not work on your data at all. If
you know exactly the kind of strings you will have to compress, a better
solution is to generate custom codebooks which you can then use with
smaz.

Empirically, `generate` has been found to produce fairly good codebooks
in a reasonable amount of time, assuming your input data does not exceed
100k strings. If you use it with more, it could still work but may take
a lot of time.

## Usage

Generating a codebook:
```javascript
const { generate } = require('@remusao/smaz-generate');
const codebook = generate([
  'foo',
  'bar',
  'baz',
]);
```

Using a custom codebook:
```javascript
const { Smaz } = require('@remusao/smaz');
const smaz = new Smaz(codebook);
const compressed = smaz.compress('foo');
smaz.decompress(compressed); // 'foo'
```
