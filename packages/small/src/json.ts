import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'application/json';

const resource: Resource = {
  name: `${PREFIX}.json`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.json', 'json'],
  body: '0',
};
export default resource;
