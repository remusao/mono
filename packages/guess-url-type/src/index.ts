import { EXTENSIONS as DOCUMENT_EXTENSIONS } from './extensions/documents.js';
import { EXTENSIONS as FONT_EXTENSIONS } from './extensions/fonts.js';
import { EXTENSIONS as IMAGE_EXTENSIONS } from './extensions/images.js';
import { EXTENSIONS as MEDIA_EXTENSIONS } from './extensions/medias.js';
import { EXTENSIONS as SCRIPT_EXTENSIONS } from './extensions/scripts.js';
import { EXTENSIONS as STYLE_EXTENSIONS } from './extensions/stylesheets.js';

import { extname } from './extname.js';

export type RequestType =
  | 'stylesheet'
  | 'font'
  | 'document'
  | 'image'
  | 'media'
  | 'other'
  | 'script';

export default function getRequestType(url: string): RequestType {
  const ext = extname(url);

  // Images
  if (
    IMAGE_EXTENSIONS.has(ext) ||
    url.startsWith('data:image/') ||
    url.startsWith('https://frog.wix.com/bt')
  ) {
    return 'image';
  }

  // Medias
  if (
    MEDIA_EXTENSIONS.has(ext) ||
    url.startsWith('data:audio/') ||
    url.startsWith('data:video/')
  ) {
    return 'media';
  }

  // Stylesheets
  if (STYLE_EXTENSIONS.has(ext) || url.startsWith('data:text/css')) {
    return 'stylesheet';
  }

  // Scripts
  if (
    SCRIPT_EXTENSIONS.has(ext) ||
    (url.startsWith('data:') &&
      (url.startsWith('data:application/ecmascript') ||
        url.startsWith('data:application/javascript') ||
        url.startsWith('data:application/x-ecmascript') ||
        url.startsWith('data:application/x-javascript') ||
        url.startsWith('data:text/ecmascript') ||
        url.startsWith('data:text/javascript') ||
        url.startsWith('data:text/javascript1.0') ||
        url.startsWith('data:text/javascript1.1') ||
        url.startsWith('data:text/javascript1.2') ||
        url.startsWith('data:text/javascript1.3') ||
        url.startsWith('data:text/javascript1.4') ||
        url.startsWith('data:text/javascript1.5') ||
        url.startsWith('data:text/jscript') ||
        url.startsWith('data:text/livescript') ||
        url.startsWith('data:text/x-ecmascript') ||
        url.startsWith('data:text/x-javascript'))) ||
    url.startsWith('https://maps.googleapis.com/maps/api/js') ||
    url.startsWith('https://www.googletagmanager.com/gtag/js')
  ) {
    return 'script';
  }

  // Documents
  if (
    DOCUMENT_EXTENSIONS.has(ext) ||
    url.startsWith('data:text/html') ||
    url.startsWith('data:application/xhtml') ||
    url.startsWith('https://www.youtube.com/embed/') ||
    url.startsWith('https://www.google.com/gen_204')
  ) {
    return 'document';
  }

  // Fonts
  if (FONT_EXTENSIONS.has(ext) || url.startsWith('data:font/')) {
    return 'font';
  }

  return 'other';
}
