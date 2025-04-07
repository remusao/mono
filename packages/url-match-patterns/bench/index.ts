import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import bench from '@remusao/bench';

import { Pattern } from '../src/index.js';

import match from 'url-match-patterns';
import matchUrl from 'match-url-wildcard';

(() => {
  // Measure matching of patterns
  const rawPattern = 'https://example.com/*';
  const pattern1 = match.default(rawPattern);
  const pattern2 = new Pattern(rawPattern);
  const urls = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'urls.txt'),
    'utf-8',
  )
    .trim()
    .split('\n');
  console.log('Match (ops/second)', {
    'url-match-pattern': bench((url: string) => pattern1(url), urls),
    '@remusao/url-match-pattern': bench(
      (url: string) => pattern2.match(url),
      urls,
    ),
    'url-match-wildcard': bench(
      (url: string) => matchUrl.default(url, rawPattern),
      urls,
    ),
  });

  // Measure compilation of patterns
  console.log('Compile (ops/second)', {
    'url-match-pattern': bench(match.default, ['https://*/*']),
    '@remusao/url-match-pattern': bench(
      (pattern) => new Pattern(pattern),
      ['https://*/*'],
    ),
  });
})();
