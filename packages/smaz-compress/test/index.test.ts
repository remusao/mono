import { expect } from 'chai';
import 'mocha';

import { SmazCompress } from '../src/index.js';

describe('@remusao/smaz-compress', () => {
  it('compresses empty string', () => {
    const smaz = new SmazCompress([]);
    expect(smaz.compress('')).to.be.empty;
    expect(smaz.getCompressedSize('')).to.eql(0);
  });

  it('compresses string not from codebook', () => {
    const smaz = new SmazCompress(['foo']);
    expect(smaz.getCompressedSize('bar')).to.equal(5);
    expect(smaz.compress('bar')).to.deep.equal(
      new Uint8Array([
        255, // VERBATIM
        3, // 'bar'.length
        'b'.charCodeAt(0),
        'a'.charCodeAt(0),
        'r'.charCodeAt(0),
      ]),
    );
  });

  it('compresses string from codebook', () => {
    const smaz = new SmazCompress(['foo']);
    expect(smaz.getCompressedSize('foo')).to.be.equal(1);
    expect(smaz.compress('foo')).to.deep.equal(new Uint8Array([0]));
  });

  it('compresses with a mix', () => {
    const smaz = new SmazCompress(['foo']);

    expect(smaz.getCompressedSize('barfoob')).to.be.equal(8);
    expect(smaz.compress('barfoob')).to.deep.equal(
      new Uint8Array([
        255, // VERBATIM
        3, // 'bar'.length
        'b'.charCodeAt(0),
        'a'.charCodeAt(0),
        'r'.charCodeAt(0),
        0, // 'foo'
        254, // VERBATIM
        'b'.charCodeAt(0),
      ]),
    );

    expect(smaz.getCompressedSize('bfoobar')).to.eql(8);
    expect(smaz.compress('bfoobar')).to.deep.equal(
      new Uint8Array([
        254, // VERBATIM
        'b'.charCodeAt(0),
        0, // 'foo'
        255, // VERBATIM
        3, // 'bar'.length
        'b'.charCodeAt(0),
        'a'.charCodeAt(0),
        'r'.charCodeAt(0),
      ]),
    );
  });

  it('handles ambiguous codebook', () => {
    const smaz = new SmazCompress([
      'f',
      'fo',
      'foo',
      'foob',
      'fooba',
      'foobar',
      'foobarb',
      'foobarba',
      'foobarbaz',
    ]);

    const checkCompress = (str: string, size: number) => {
      const compressed = smaz.compress(str);
      expect(compressed).to.have.length(size);
      expect(smaz.getCompressedSize(str)).to.eql(size);
    };

    checkCompress('f', 1);
    checkCompress('fo', 1);
    checkCompress('foo', 1);
    checkCompress('foob', 1);
    checkCompress('fooba', 1);
    checkCompress('foobar', 1);
    checkCompress('foobarb', 1);
    checkCompress('foobarba', 1);
    checkCompress('foobarbaz', 1);
    checkCompress('foobarbazf', 2);
    checkCompress('foobarbazfo', 2);

    // TODO - add @remusao/smaz-decompress as dev dependency to test.
  });

  it('fills verbatim buffer', () => {
    const smaz = new SmazCompress(['foo']);

    let str = '';
    for (let i = 0; i <= 256; i += 1) {
      str += 'b';
    }

    const compressed = smaz.compress(str);
    expect(compressed.length).to.be.eql(smaz.getCompressedSize(str));
  });

  it('compresses Uint8Array with unicode', () => {
    const smaz = new SmazCompress(['foo']);
    const text = '한글';
    const utf8 = new TextEncoder().encode(text);
    expect(smaz.compress(new Uint8Array([
      ...utf8,
      'f'.charCodeAt(0),
      'o'.charCodeAt(0),
      'o'.charCodeAt(0),
    ]))).to.deep.equal(
      new Uint8Array([
        255,
        utf8.byteLength,
        ...utf8,
        0, // 'foo'
      ]),
    );
  });
});
