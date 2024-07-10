import { expect } from 'chai';
import 'mocha';

import { EXTENSIONS as DOCUMENT_EXTENSIONS } from '../src/extensions/documents.js';
import { EXTENSIONS as FONT_EXTENSIONS } from '../src/extensions/fonts.js';
import { EXTENSIONS as IMAGE_EXTENSIONS } from '../src/extensions/images.js';
import { EXTENSIONS as MEDIA_EXTENSIONS } from '../src/extensions/medias.js';
import { EXTENSIONS as SCRIPT_EXTENSIONS } from '../src/extensions/scripts.js';
import { EXTENSIONS as STYLE_EXTENSIONS } from '../src/extensions/stylesheets.js';

import { extname } from '../src/extname.js';

import guessRequestType from '../src/index.js';

describe('@remusao/guess-url-type', () => {
  describe ('#extname', () => {
    it('returns empty string if no extension', () => {
      expect(extname('https://example.com/foo')).to.equal('');
    });

    it('returns simple extension', () => {
      expect(extname('https://example.com/foo.js')).to.equal('js');
    });

    it('ignores fragment', () => {
      expect(extname('https://example.com/foo.js#fragment')).to.equal('js');
    });

    it('ignores query', () => {
      expect(extname('https://example.com/foo.js?query')).to.equal('js');
    });

    it('ignores query and fragment', () => {
      expect(extname('https://example.com/foo.js?query#fragment')).to.equal('js');
    });

    it('ignores too long extension', () => {
      expect(extname('https://example.com/foo.aaaaaaaaaaa')).to.equal('');
    });
  });

  for (const [type, extensions] of [
    ['document', DOCUMENT_EXTENSIONS],
    ['font', FONT_EXTENSIONS],
    ['image', IMAGE_EXTENSIONS],
    ['media', MEDIA_EXTENSIONS],
    ['script', SCRIPT_EXTENSIONS],
    ['stylesheet', STYLE_EXTENSIONS],
  ] as [string, Set<string>][]) {
    describe(`detects ${type} based on extension`, () => {
      for (const ext of extensions) {
        it(`${ext}`, () => {
          expect(guessRequestType(`https://example.com/file.${ext}`)).to.equal(
            type,
          );

          expect(
            guessRequestType(`https://example.com/file.${ext}?query=42`),
          ).to.equal(type);

          expect(
            guessRequestType(
              `https://example.com/file.${ext}?query=42#fragment`,
            ),
          ).to.equal(type);
        });
      }
    });
  }

  describe('falls-back to other', () => {
    it('when extension is unknown', () => {
      expect(guessRequestType('https://example.com/file.unknown')).to.equal('other');
    });

    it('when there is no extension', () => {
      expect(guessRequestType('https://example.com/file')).to.equal('other');
    });
  });

  describe('data:', () => {
    for (const [type, mime] of [
      ['document', 'application/xhtml'],
      ['document', 'application/xhtml+xml'],
      ['document', 'text/html'],
      ['font', 'font/woff'],
      ['image', 'image/png'],
      ['media', 'audio/mpeg'],
      ['media', 'audio/vorbis'],
      ['media', 'video/mp4'],
      ['other', 'application/octet-stream'],
      ['other', 'application/pdf'],
      ['other', 'model/vml'],
      ['other', 'text/plain'],
      ['script', 'application/ecmascript'],
      ['script', 'application/javascript'],
      ['script', 'application/x-ecmascript'],
      ['script', 'application/x-javascript'],
      ['script', 'text/ecmascript'],
      ['script', 'text/javascript'],
      ['script', 'text/javascript1.0'],
      ['script', 'text/javascript1.1'],
      ['script', 'text/javascript1.2'],
      ['script', 'text/javascript1.3'],
      ['script', 'text/javascript1.4'],
      ['script', 'text/javascript1.5'],
      ['script', 'text/jscript'],
      ['script', 'text/livescript'],
      ['script', 'text/x-ecmascript'],
      ['script', 'text/x-javascript'],
      ['stylesheet', 'text/css'],
    ]) {
      it(`detect ${type} for MIME ${mime}`, () => {
        expect(guessRequestType(`data:${mime},foo`)).to.equal(type);
        expect(guessRequestType(`data:${mime};base64,foo`)).to.equal(type);
      });
    }
  });
});
