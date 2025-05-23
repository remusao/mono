import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'video/flv';

const resource: Resource = {
  name: `${PREFIX}.flv`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.flv', 'flv'],
  body: 'RkxWAQEAAAAJAAAAABIAALgAAAAAAAAAAgAKb25NZXRhRGF0YQgAAAAIAAhkdXJhdGlvbgAAAAAAAAAAAAAFd2lkdGgAP/AAAAAAAAAABmhlaWdodAA/8AAAAAAAAAANdmlkZW9kYXRhcmF0ZQBAaGoAAAAAAAAJZnJhbWVyYXRlAEBZAAAAAAAAAAx2aWRlb2NvZGVjaWQAQAAAAAAAAAAAB2VuY29kZXICAA1MYXZmNTcuNDEuMTAwAAhmaWxlc2l6ZQBAaoAAAAAAAAAACQAAAMM=',
};
export default resource;
