import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/vnd.microsoft.icon';

const resource: Resource = {
  name: `${PREFIX}.ico`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.ico', 'ico'],
  body: 'AAABAAEAAQEAAAEAGAAwAAAAFgAAACgAAAABAAAAAgAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAA==',
};
export default resource;
