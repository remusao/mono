import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'text/plain';

const resource: Resource = {
  name: `${PREFIX}.txt`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.txt', 'txt', 'text', 'nooptext', 'noop.txt'],
  body: '',
};
export default resource;
