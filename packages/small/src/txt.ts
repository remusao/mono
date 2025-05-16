import { PREFIX } from './types.js';

export const CONTENT_TYPE = 'text/plain';

export default {
  name: `${PREFIX}.txt`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.txt', 'txt', 'text', 'nooptext', 'noop.txt'],
  body: '',
} as const;
