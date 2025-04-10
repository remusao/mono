import { expect } from 'chai';
import 'mocha';

import { SmazDecompress, SmazDecompressRaw } from '../src/index.js';

describe('@remusao/smaz-compress', () => {
  context('SmazDecompress', () => {
    it('decompresses empty array', () => {
      const smaz = new SmazDecompress(['foo']);
      expect(smaz.decompress(new Uint8Array(0))).to.equal('');
    });

    it('decompresses string from codebook', () => {
      const smaz = new SmazDecompress(['foo']);
      expect(smaz.decompress(new Uint8Array([0]))).to.equal('foo');
    });

    it('decompresses verbatim character', () => {
      const smaz = new SmazDecompress(['foo']);
      expect(
        smaz.decompress(new Uint8Array([254, 'b'.charCodeAt(0)])),
      ).to.equal('b');
    });

    it('decompresses verbatim string', () => {
      const smaz = new SmazDecompress(['foo']);
      expect(
        smaz.decompress(
          new Uint8Array([
            255,
            3,
            'b'.charCodeAt(0),
            'a'.charCodeAt(0),
            'r'.charCodeAt(0),
          ]),
        ),
      ).to.equal('bar');
    });

    it('decompresses a mix', () => {
      const smaz = new SmazDecompress(['foo', 'baz']);
      expect(
        smaz.decompress(
          new Uint8Array([
            254,
            'b'.charCodeAt(0),
            0, // 'foo'
            1, // 'baz'
            255,
            3,
            'b'.charCodeAt(0),
            'a'.charCodeAt(0),
            'r'.charCodeAt(0),
          ]),
        ),
      ).to.equal('bfoobazbar');
    });
  });

  context('SmazDecompressRaw', () => {
    it('decompresses a utf8 container', () => {
      const smaz = SmazDecompressRaw.fromStringCodebook(['foo']);
      const text = '한글';
      const utf8 = new TextEncoder().encode(text);
      const decompressed = smaz.decompress(
        new Uint8Array([
          255,
          utf8.byteLength,
          ...utf8,
          0, // 'foo'
        ]),
      );
      expect(
        new TextDecoder('utf8', { ignoreBOM: true }).decode(decompressed),
      ).to.equal(`${text}foo`);
    });

    it('decompresses with unicode codebook', () => {
      const smaz = SmazDecompressRaw.fromStringCodebook(['🥳']);
      const utf8 = new TextEncoder().encode('🥳');
      const decompressed = smaz.decompress(
        new Uint8Array([
          255,
          utf8.byteLength,
          ...utf8,
          254,
          65, // 'A'
        ]),
      );
      expect(
        new TextDecoder('utf8', { ignoreBOM: true }).decode(decompressed),
      ).to.equal(`🥳A`);
    });
  });
});
