import { create, lookup } from './index';

describe('@remusao/trie', () => {
  describe('#create', () => {
    it('empty trie', () => {
      const trie = create([]);
      expect(trie.code).toBeUndefined();
      expect(trie.chars).toHaveLength(128);
      expect(lookup(trie, '')).toBe(false);
      expect(lookup(trie, 'foo')).toBe(false);
    });

    it('trie with one string', () => {
      const trie = create(['aaaa']);
      expect(lookup(trie, '')).toBe(false);
      expect(lookup(trie, 'a')).toBe(false);
      expect(lookup(trie, 'aa')).toBe(false);
      expect(lookup(trie, 'aaa')).toBe(false);
      expect(lookup(trie, 'aaaa')).toBe(true);
      expect(lookup(trie, 'aaaaa')).toBe(false);
    });

    it('trie with two strings', () => {
      const trie = create(['aaaa', 'aaab']);
      expect(lookup(trie, '')).toBe(false);
      expect(lookup(trie, 'a')).toBe(false);
      expect(lookup(trie, 'aa')).toBe(false);
      expect(lookup(trie, 'aaa')).toBe(false);
      expect(lookup(trie, 'aaaa')).toBe(true);
      expect(lookup(trie, 'aaab')).toBe(true);
      expect(lookup(trie, 'aaaaa')).toBe(false);
    });
  });
});
