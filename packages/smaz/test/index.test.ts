import { expect } from 'chai';
import 'mocha';

import { compress, decompress, decompressRaw, getCompressedSize } from '../src/index.js';

describe('@remusao/smaz', () => {
  [
    '',
    'This is a small string',
    'foobar',
    'the end',
    'not-a-g00d-Exampl333',
    'Smaz is a simple compression library',
    'Nothing is more difficult, and therefore more precious, than to be able to decide',
    'this is an example of what works very well with smaz',
    '1000 numbers 2000 will 10 20 30 compress very little',
    'Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura',
    'Mi illumino di immenso',
    "L'autore di questa libreria vive in Sicilia",
    'http://google.com',
    'http://programming.reddit.com',
    'http://github.com/antirez/smaz/tree/master',
  ].forEach((str) => {
    it(str, () => {
      const compressed = compress(str);
      expect(compressed).to.have.length(getCompressedSize(str));
      expect(decompress(compressed)).to.equal(str);
    });
  });

  context('utf8', () => {
    [
      '한글',
      '日本語',
      '中華料理'
    ].forEach(str => {
      it(str, () => {
        const encoded = new TextEncoder().encode(str);
        const compressed = compress(encoded);
        expect(compressed).to.have.length(getCompressedSize(encoded));
        expect(new TextDecoder('utf8').decode(decompressRaw(compressed))).to.equal(str);
      })
    })
  })
});
