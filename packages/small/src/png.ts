import { namePrefix } from './types.js';

export const CONTENT_TYPE = 'image/png';

export default {
  name: `${namePrefix}.png`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.png', 'png'],
  body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
} as const;
