# `@remusao/url-match-patterns`

> Test URLs against match patterns, as defined by [Google](https://developer.chrome.com/extensions/match_patterns) and [Mozilla](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Match_patterns).

```typescript
import match, { Pattern } from '@remusao/url-match-patterns';

// check that a url matches
match('*://*/*', 'https://www.example.com'); // true

// pre-compile pattern for faster performance
const pattern = new Pattern('*://*/*');
pattern.match('https://www.example.com'); // true

// More examples
match('<all_urls>', 'https://www.example.com'); // true
match('https://example.com/*', 'https://www.example.com'); // false
match('https://*.example.com/*', 'https://www.example.com'); // true
```
