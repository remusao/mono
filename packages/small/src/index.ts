import flv from './flv.js';
import gif from './gif.js';
import html from './html.js';
import ico from './ico.js';
import jpg from './jpeg.js';
import js from './javascript.js';
import json from './json.js';
import mp3 from './mp3.js';
import mp4 from './mp4.js';
import pdf from './pdf.js';
import png from './png.js';
import svg from './svg.js';
import txt from './txt.js';
import wav from './wav.js';
import webm from './webm.js';
import webp from './webp.js';
import wmv from './wmv.js';

// List of mime types:
// - [ ] .aac 	AAC audio 	audio/aac
// - [ ] .abw 	AbiWord document 	application/x-abiword
// - [ ] .arc 	Archive document (multiple files embedded) 	application/x-freearc
// - [ ] .avi 	AVI: Audio Video Interleave 	video/x-msvideo
// - [ ] .azw 	Amazon Kindle eBook format 	application/vnd.amazon.ebook
// - [ ] .bin 	Any kind of binary data 	application/octet-stream
// - [ ] .bmp 	Windows OS/2 Bitmap Graphics 	image/bmp
// - [ ] .bz 	BZip archive 	application/x-bzip
// - [ ] .bz2 	BZip2 archive 	application/x-bzip2
// - [ ] .csh 	C-Shell script 	application/x-csh
// - [ ] .css 	Cascading Style Sheets (CSS) 	text/css
// - [ ] .csv 	Comma-separated values (CSV) 	text/csv
// - [ ] .doc 	Microsoft Word 	application/msword
// - [ ] .docx 	Microsoft Word (OpenXML) 	application/vnd.openxmlformats-officedocument.wordprocessingml.document
// - [ ] .eot 	MS Embedded OpenType fonts 	application/vnd.ms-fontobject
// - [ ] .epub 	Electronic publication (EPUB) 	application/epub+zip
// - [ ] .gz 	GZip Compressed Archive 	application/gzip
// - [x] .gif 	Graphics Interchange Format (GIF) 	image/gif
// - [x] .htm, .html 	HyperText Markup Language (HTML) 	text/html
// - [x] .ico 	Icon format 	image/vnd.microsoft.icon
// - [ ] .ics 	iCalendar format 	text/calendar
// - [ ] .jar 	Java Archive (JAR) 	application/java-archive
// - [x] .jpeg, .jpg 	JPEG images 	image/jpeg
// - [x] .js 	JavaScript 	text/javascript
// - [x] .json 	JSON format 	application/json
// - [ ] .jsonld 	JSON-LD format 	application/ld+json
// - [ ] .mid
// - [ ] .midi 	Musical Instrument Digital Interface (MIDI) 	audio/midi audio/x-midi
// - [ ] .mjs 	JavaScript module 	text/javascript
// - [x] .mp3 	MP3 audio 	audio/mpeg
// - [ ] .mpeg 	MPEG Video 	video/mpeg
// - [ ] .mpkg 	Apple Installer Package 	application/vnd.apple.installer+xml
// - [ ] .odp 	OpenDocument presentation document 	application/vnd.oasis.opendocument.presentation
// - [ ] .ods 	OpenDocument spreadsheet document 	application/vnd.oasis.opendocument.spreadsheet
// - [ ] .odt 	OpenDocument text document 	application/vnd.oasis.opendocument.text
// - [ ] .oga 	OGG audio 	audio/ogg
// - [ ] .ogv 	OGG video 	video/ogg
// - [ ] .ogx 	OGG 	application/ogg
// - [ ] .opus 	Opus audio 	audio/opus
// - [ ] .otf 	OpenType font 	font/otf
// - [x] .png 	Portable Network Graphics 	image/png
// - [x] .pdf 	Adobe Portable Document Format (PDF) 	application/pdf
// - [ ] .php 	Hypertext Preprocessor (Personal Home Page) 	application/php
// - [ ] .ppt 	Microsoft PowerPoint 	application/vnd.ms-powerpoint
// - [ ] .pptx 	Microsoft PowerPoint (OpenXML) 	application/vnd.openxmlformats-officedocument.presentationml.presentation
// - [ ] .rar 	RAR archive 	application/vnd.rar
// - [ ] .rtf 	Rich Text Format (RTF) 	application/rtf
// - [ ] .sh 	Bourne shell script 	application/x-sh
// - [x] .svg 	Scalable Vector Graphics (SVG) 	image/svg+xml
// - [ ] .swf 	Small web format (SWF) or Adobe Flash document 	application/x-shockwave-flash
// - [ ] .tar 	Tape Archive (TAR) 	application/x-tar
// - [ ] .tif
// - [ ] .tiff 	Tagged Image File Format (TIFF) 	image/tiff
// - [ ] .ts 	MPEG transport stream 	video/mp2t
// - [ ] .ttf 	TrueType Font 	font/ttf
// - [ ] .txt 	Text, (generally ASCII or ISO 8859-n) 	text/plain
// - [ ] .vsd 	Microsoft Visio 	application/vnd.visio
// - [x] .wav 	Waveform Audio Format 	audio/wav
// - [ ] .weba 	WEBM audio 	audio/webm
// - [x] .webm 	WEBM video 	video/webm
// - [x] .webp 	WEBP image 	image/webp
// - [ ] .woff 	Web Open Font Format (WOFF) 	font/woff
// - [ ] .woff2 	Web Open Font Format (WOFF) 	font/woff2
// - [ ] .xhtml 	XHTML 	application/xhtml+xml
// - [ ] .xls 	Microsoft Excel 	application/vnd.ms-excel
// - [ ] .xlsx 	Microsoft Excel (OpenXML) 	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// - [ ] .xml 	XML 	application/xml if not readable from casual users (RFC 3023, section 3)
// - [ ] text/xml if readable from casual users (RFC 3023, section 3)
// - [ ] .xul 	XUL 	application/vnd.mozilla.xul+xml
// - [ ] .zip 	ZIP archive 	application/zip
// - [ ] .3gp 	3GPP audio/video container 	video/3gpp, audio/3gpp if it doesn't contain video
// - [ ] .3g2 	3GPP2 audio/video container 	video/3gpp2, audio/3gpp2 if it doesn't contain video
// - [ ] .7z 	7-zip archive 	application/x-7z-compressed

type Resource = {
  contentType: string;
  aliases: string[];
  body: string;
};

const MIME_TO_RESOURCE = (() => {
  const resources: {
    [mime: string]: Resource;
  } = {};
  for (const fake of [
    flv,
    gif,
    html,
    ico,
    jpg,
    js,
    json,
    mp3,
    mp4,
    pdf,
    png,
    svg,
    txt,
    wav,
    webm,
    webp,
    wmv,
  ]) {
    for (const alias of fake.aliases) {
      resources[alias] = fake;
    }
  }

  return resources;
})();

export function getFallbackTextResource() {
  return txt;
}

export function getFallbackBlobResource(): Resource {
  return {
    contentType: 'application/octet-stream;base64',
    aliases: ['application/octet-stream'],
    body: 'Cg==',
  };
}

export function hasResourceForMime(mime: string): boolean {
  return MIME_TO_RESOURCE[mime] !== undefined;
}

export function getResourceForMime(mime: string) {
  return MIME_TO_RESOURCE[mime] || getFallbackTextResource();
}

export function getDataUrlForMime(mime: string): string {
  const { contentType, body } = getResourceForMime(mime);
  return `data:${contentType},${body}`;
}

export {
  flv,
  gif,
  html,
  ico,
  jpg,
  js,
  json,
  mp3,
  mp4,
  pdf,
  png,
  svg,
  txt,
  wav,
  webm,
  webp,
  wmv,
};

export const resources = [
  flv,
  gif,
  html,
  ico,
  jpg,
  js,
  json,
  mp3,
  mp4,
  pdf,
  png,
  svg,
  txt,
  wav,
  webm,
  webp,
  wmv,
] satisfies Resource[];
