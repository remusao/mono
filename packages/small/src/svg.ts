import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/svg+xml';

const resource: Resource = {
  name: `${PREFIX}.svg`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.svg', 'svg'],
  body: 'https://raw.githubusercontent.com/mathiasbynens/small/master/svg.svg',
};
export default resource;
