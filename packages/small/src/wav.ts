import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'audio/wav';

const resource: Resource = {
  name: `${PREFIX}.wav`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.wav', 'wav'],
  body: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
};
export default resource;
