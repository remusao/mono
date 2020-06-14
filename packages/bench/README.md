# `@remusao/bench`

> Easily measure performance of a function against array of inputs.

```typescript
import bench from '@remusao/bench';

function getLengthOfUrl(url: string): number {
  return url.length;
}

const opsPerSecond = bench(getLengthOfUrl, [
  '',
  'https://example.com',
  'http://foo.bar',
]);
```
