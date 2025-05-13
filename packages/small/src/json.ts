import { namePrefix } from './types.js';

export const CONTENT_TYPE = 'application/json';

export default {
  name: `${namePrefix}.json`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.json', 'json'],
  body: '0',
} as const;
