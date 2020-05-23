# `@remusao/badger`

> A high-level abstraction to manipulate browser action badge in extensions

## Usage

```javascript
const { Badger } = require('@remusao/badger');

const badge = new Badge({
  // Optionally customize badge text and background colors.
  badgeTextColor: 'red', // default: 'white'
  badgeBackgroundColor: 'black', // default: 'blue'

  // Icon can be toggled using the `enable()` and `disable()` methods.
  iconDisabled: './path/to/icon-disabled.png',
  iconEnabled: './path/to/icon-enabled.png',
  // NOTE: You can specify an array of images in `iconEnabled` so that badge is
  // animated when the badge text is updated (e.g. when a counter is increased).

  // Throttle updates of badge to reduce CPU usage.
  minimumUpdateLatency: 250, // default: 500
});

badge.incr(0); // increment count for tabId `0`
badge.reset(0); // reset count for tabId `0`
badge.disable(); // disable badge globally
badge.enable(); // enable badge globally (default state)
```
