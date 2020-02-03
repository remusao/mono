# `@remusao/smaz-benchmarks`

> Benchmark various small string compression libraries

### Compression

| Library | Bytes per second | Compression (of initial size) |
| ------- | ---------------- | ----------------------------- |
| **@remusao/smaz** | **75,553,384** | **63%** |
| [shorter](https://github.com/lovell/shorter) | 12,905,796 | 73% |
| [zlib](https://nodejs.org/api/zlib.html) | 2,676,138 | 149% |
| [smaz](https://github.com/personalcomputer/smaz.js) | 1,792,476 | **63%** |
| [tiny-string](https://github.com/dcmox/tiny-string) | 887,171 | 69% |


There are two libraries which I could not add to the benchmark
yet: [smaz.js](https://www.npmjs.com/package/smaz.js) (a
wrapper of the original C implementation of Smaz, but
does not compile on a recent version of Node.js), and
[compatto](https://www.npmjs.com/package/compatto) (which failed to
run).

### Decompression

| Library | Bytes per second |
| ------- | ---------------- |
| **@remusao/smaz** | **92,886,643** |
| [shorter](https://github.com/lovell/shorter) | 72,339,518 |
| [zlib](https://nodejs.org/api/zlib.html) | 6,950,516 |
| [smaz](https://github.com/personalcomputer/smaz.js) | **98,604,792** |
| [tiny-string](https://github.com/dcmox/tiny-string) | 716,938 |
