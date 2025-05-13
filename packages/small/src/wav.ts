import { namePrefix } from './types.js';

export const CONTENT_TYPE = 'audio/wav';

export default {
  name: `${namePrefix}.wav`,
  contentType: `${CONTENT_TYPE};base64`,
  aliases: [CONTENT_TYPE, '.wav', 'wav'],
  body: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
} as const;
