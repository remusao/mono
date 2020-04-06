const STYLE_EXTENSIONS = new Set(['css', 'scss']);

const IMAGE_EXTENSIONS = new Set([
  'bmp',
  'bmp',
  'dib',
  'eps',
  'gif',
  'heic',
  'heif',
  'ico',
  'j2k',
  'jfi',
  'jfif',
  'jif',
  'jp2',
  'jpe',
  'jpeg',
  'jpeg',
  'jpf',
  'jpg',
  'jpg',
  'jpm',
  'jpx',
  'mj2',
  'png',
  'svg',
  'svgz',
  'tif',
  'tiff',
  'webp',
]);

const MEDIA_EXTENSIONS = new Set([
  'avi',
  'flv',
  'mp3',
  'mp4',
  'wav',
  'weba',
  'webm',
  'wmv',
]);

const SCRIPT_EXTENSIONS = new Set(['js', 'ts', 'jsx', 'esm']);

const DOCUMENT_EXTENSIONS = new Set(['htm', 'html', 'xhtml']);

const FONT_EXTENSIONS = new Set(['woff', 'woff2', 'eot', 'ttf']);

export type RequestType =
  | 'stylesheet'
  | 'font'
  | 'document'
  | 'image'
  | 'media'
  | 'other'
  | 'script';

function extname(url: string): string {
  let endOfPath = url.length;

  // Check for fragment
  const indexOfFragment = url.indexOf('#');
  if (indexOfFragment !== -1) {
    endOfPath = indexOfFragment;
  }

  const indexOfQuery = url.indexOf('?');
  if (indexOfQuery !== -1 && indexOfQuery < endOfPath) {
    endOfPath = indexOfQuery;
  }

  let startOfExt = endOfPath - 1;
  let code = 0;
  for (; startOfExt >= 0; startOfExt -= 1) {
    code = url.charCodeAt(startOfExt);
    if (
      ((code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        (code >= 48 && code <= 57)) === false
    ) {
      break;
    }
  }

  if (code !== 46 || startOfExt < 0 || endOfPath - startOfExt >= 10) {
    return '';
  }

  return url.slice(startOfExt + 1, endOfPath);
}

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
    return 'image';
  }

  // Stylesheets
  if (STYLE_EXTENSIONS.has(ext) || url.startsWith('data:text/css')) {
    return 'stylesheet';
  }

  // Scripts
  if (
    SCRIPT_EXTENSIONS.has(ext) ||
    url.startsWith('data:application/javascript') ||
    url.startsWith('data:text/javascript') ||
    url.startsWith('data:application/x-javascript') ||
    url.startsWith('https://maps.googleapis.com/maps/api/js') ||
    url.startsWith('https://www.googletagmanager.com/gtag/js')
  ) {
    return 'script';
  }

  // Documents
  if (
    DOCUMENT_EXTENSIONS.has(ext) ||
    url.startsWith('data:text/html') ||
    url.startsWith('https://www.youtube.com/embed/') ||
    url === 'https://www.google.ie/gen_204'
  ) {
    return 'document';
  }

  // Fonts
  if (FONT_EXTENSIONS.has(ext) || url.startsWith('data:font/')) {
    return 'font';
  }

  return 'other';
}
