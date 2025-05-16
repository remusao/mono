import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'image/svg+xml';

export default {
  name: `${PREFIX}.svg`,
  contentType: CONTENT_TYPE,
  aliases: [CONTENT_TYPE, '.svg', 'svg'],
  body: 'https://raw.githubusercontent.com/mathiasbynens/small/master/svg.svg',
} as Resource;
