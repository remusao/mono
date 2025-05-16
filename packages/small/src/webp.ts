import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/webp';

const resource: Resource = {
  name: `${PREFIX}.webp`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.webp', 'webp'],
  body: 'UklGRhIAAABXRUJQVlA4TAYAAAAvQWxvAGs=',
};
export default resource;
