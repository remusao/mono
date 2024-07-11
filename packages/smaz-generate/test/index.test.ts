import { expect } from 'chai';
import 'mocha';

import { Smaz } from '@remusao/smaz';

import { generate, Builder } from '../src/index.js';

describe('@remusao/smaz-generate', () => {
  describe('#Builder', () => {
    it('yields all strings', () => {
      const builder = new Builder(['a', 'aa', 'foo', 'bar', 'baz']);
      expect([...builder.entries()]).to.deep.equal([
        ['a', 1],
        ['aa', 1],
        ['foo', 1],
        ['bar', 1],
        ['baz', 1],
      ]);
    });

    describe('#removeWithSubstring', () => {
      it('no-op if substring is nowhere in original strings', () => {
        const builder = new Builder(['foo', 'bar']);
        const { added, removed } = builder.removeWithSubstring('baz');
        expect(added.size).to.equal(0);
        expect(removed.size).to.equal(0);
        expect([...builder.entries()]).to.deep.equal([['foo', 1], ['bar', 1]]);
      });

      it('removes full entries', () => {
        const builder = new Builder(['foo', 'bar']);
        const { added, removed } = builder.removeWithSubstring('bar');
        expect(added.size).to.equal(0);
        expect([...removed.entries()]).to.deep.equal([['bar', 1]]);
        expect([...builder.entries()]).to.deep.equal([['foo', 1]]);
      });

      it('removes partial entries', () => {
        const builder = new Builder(['foo', 'bar', 'baz', 'foobarbaz', 'foobar', 'barfoo']);
        const { added, removed } = builder.removeWithSubstring('foo');

        expect([...added.entries()]).to.deep.equal([
          ['barbaz', 1],
          ['bar', 2],
        ]);

        expect([...removed.entries()]).to.deep.equal([
          ['foo', 1],
          ['foobarbaz', 1],
          ['foobar', 1],
          ['barfoo', 1],
        ]);

        expect([...builder.entries()]).to.deep.equal([
          ['bar', 1],
          ['baz', 1],
          ['barbaz', 1],
          ['bar', 2],
        ]);
      });

      it('removes overlapping entries', () => {
        const builder = new Builder(['foo', 'bar', 'baz', 'foobarbaz', 'foobar', 'barfoo']);
        builder.removeWithSubstring('foo');
        const { added, removed } = builder.removeWithSubstring('ar');

        expect([...added.entries()]).to.deep.equal([
          ['b', 4],
          ['baz', 1],
        ]);

        expect([...removed.entries()]).to.deep.equal([
          ['bar', 3],
          ['barbaz', 1],
        ]);

        expect([...builder.entries()]).to.deep.equal([
          ['baz', 1],
          ['b', 4],
          ['baz', 1],
        ]);
      });
    });
  });

  it('has perfect compression on small input', () => {
    const custom = new Smaz(generate(['foo', 'bar', 'baz'], {
      finetuneNgrams: [1, 2, 3],
    }));

    const checkCompress = (str: string, size: number) => {
      const compressed = custom.compress(str);
      expect(compressed).to.have.length(size);
      expect(custom.decompress(compressed)).to.equal(str);
    };

    // Compression is one byte for seen strings
    for (const str of ['foo', 'bar', 'baz']) {
      checkCompress(str, 1);
    }

    checkCompress('fof', 2);
    checkCompress('zar', 2);
    checkCompress('boz', 3);
  });
});
