import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/png';

const resource: Resource = {
  name: `${PREFIX}.png`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.png', 'png'],
  body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
};
export default resource;
