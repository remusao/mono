import { expect } from 'chai';
import 'mocha';

import { SmazDecompress } from './index';

describe('@remusao/smaz-compress', () => {
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
    expect(smaz.decompress(new Uint8Array([254, 'b'.charCodeAt(0)]))).to.equal(
      'b',
    );
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
