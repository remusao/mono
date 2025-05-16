import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'text/html';

export default {
  name: `${PREFIX}.html`,
  contentType: CONTENT_TYPE,
  aliases: [
    CONTENT_TYPE,
    '.html',
    'html',
    '.htm',
    'htm',
    'noopframe',
    'noop.html',
  ],
  body: '<!DOCTYPE html>',
} as Resource;
