import { readFileSync } from 'fs';
import { join } from 'path';
import bench from '@remusao/bench';

import { Pattern } from '../index';

// @ts-ignore
import match from 'url-match-patterns';
import matchUrl from 'match-url-wildcard';

(() => {
  // Measure matching of patterns
  const rawPattern = 'https://example.com/*';
  const pattern1 = match(rawPattern);
  const pattern2 = new Pattern(rawPattern);
  const urls = readFileSync(join(__dirname, 'urls.txt'), 'utf-8').trim().split('\n');
  console.log('Match (ops/second)', {
    'url-match-pattern': bench((url: string) => pattern1(url), urls),
    '@remusao/url-match-pattern': bench((url: string) => pattern2.match(url), urls),
    'url-match-wildcard': bench((url: string) => matchUrl(url, rawPattern), urls),
  });

  // Measure compilation of patterns
  console.log('Compile (ops/second)', {
    'url-match-pattern': bench(match, ['https://*/*']),
    '@remusao/url-match-pattern': bench((pattern) => new Pattern(pattern), [
      'https://*/*',
    ]),
  });
})();
