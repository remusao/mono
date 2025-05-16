import { PREFIX, Resource } from './types.js';

export const CONTENT_TYPE = 'text/html';

const resource: Resource = {
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
};
export default resource;
