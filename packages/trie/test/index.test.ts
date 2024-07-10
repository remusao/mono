import { expect } from 'chai';
import 'mocha';

import { create, lookup } from '../src/index.js';

describe('@remusao/trie', () => {
  describe('#create', () => {
    it('empty trie', () => {
      const trie = create([]);
      expect(trie.code).to.be.undefined;
      expect(trie.chars).to.have.length(0);
      expect(lookup(trie, '')).to.be.false;
      expect(lookup(trie, 'foo')).to.be.false;
    });

    it('trie with one string', () => {
      const trie = create(['aaaa']);
      expect(lookup(trie, '')).to.be.false;
      expect(lookup(trie, 'a')).to.be.false;
      expect(lookup(trie, 'aa')).to.be.false;
      expect(lookup(trie, 'aaa')).to.be.false;
      expect(lookup(trie, 'aaaa')).to.be.true;
      expect(lookup(trie, 'aaaaa')).to.be.false;
    });

    it('trie with two strings', () => {
      const trie = create(['aaaa', 'aaab']);
      expect(lookup(trie, '')).to.be.false;
      expect(lookup(trie, 'a')).to.be.false;
      expect(lookup(trie, 'aa')).to.be.false;
      expect(lookup(trie, 'aaa')).to.be.false;
      expect(lookup(trie, 'aaaa')).to.be.true;
      expect(lookup(trie, 'aaab')).to.be.true;
      expect(lookup(trie, 'aaaaa')).to.be.false;
    });
  });
});
