import { namePrefix } from './types.js';

export const CONTENT_TYPE = 'image/vnd.microsoft.icon';

export default {
  name: `${namePrefix}.ico`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.ico', 'ico'],
  body: 'AAABAAEAAQEAAAEAGAAwAAAAFgAAACgAAAABAAAAAgAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAA==',
} as const;
