import { PREFIX } from './types.js';

export const CONTENT_TYPE = 'application/javascript';

export default {
  name: `${PREFIX}.js`,
  contentType: CONTENT_TYPE,
  aliases: [
    CONTENT_TYPE,
    '.js',
    'js',
    'javascript',
    '.jsx',
    'jsx',
    'typescript',
    '.ts',
    'ts',
    'noop.js',
    'noopjs',
  ],
  body: '',
} as const;
