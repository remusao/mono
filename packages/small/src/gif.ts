import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/gif';

const resource: Resource = {
  name: `${PREFIX}.gif`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.gif', 'gif'],
  body: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
};
export default resource;
