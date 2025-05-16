import { PREFIX } from './types.js';

export const CONTENT_TYPE = 'image/webp';

export default {
  name: `${PREFIX}.webp`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.webp', 'webp'],
  body: 'UklGRhIAAABXRUJQVlA4TAYAAAAvQWxvAGs=',
} as const;
