import { expect } from 'chai';
import 'mocha';

import { Counter } from '.';

describe('@remusao/counter', () => {
  describe('#constructor', () => {
    it('without argument', () => {
      const counter = new Counter();
      expect(counter.size).to.equal(0);
    });

    it('with initial iterable', () => {
      const counter = new Counter([
        ['foo', 1],
        ['bar', 2],
        ['baz', 3],
        ['bar', 1],
        ['foo', 2],
      ]);
      expect(counter.size).to.equal(3);
      expect(counter.get('foo')).to.equal(3);
      expect(counter.get('bar')).to.equal(3);
      expect(counter.get('baz')).to.equal(3);
    });
  });

  describe('#clear', () => {
    it('empty counter', () => {
      const counter = new Counter();
      counter.clear();
      expect(counter.size).to.equal(0);
    });

    it('counter with elements', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.size).to.equal(1);
      counter.clear();
      expect(counter.size).to.equal(0);
    });
  });

  describe('#delete', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.delete('foo')).to.be.false;
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.delete('foo')).to.be.true;
      expect(counter.size).to.equal(0);
    });
  });

  describe('#has', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.has('foo')).to.be.false;
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.has('foo')).to.be.true;
    });
  });

  describe('#get', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.get('foo')).to.equal(0);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 42]]);
      expect(counter.get('foo')).to.equal(42);
    });
  });

  describe('#incr', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.incr('foo').get('foo')).to.equal(1);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 1]]);
      expect(counter.incr('foo').incr('foo').get('foo')).to.equal(3);
    });

    it('key with custom increment', () => {
      const counter = new Counter();
      expect(counter.incr('foo', 2).incr('foo', 0).get('foo')).to.equal(2);
    });

    it('rejects negative increments', () => {
      const counter = new Counter();
      expect(() => counter.incr('foo', -1)).to.throw('Counter#incr only accepts positive values: -1');
    });
  });

  describe('#decr', () => {
    it('key which does not exist', () => {
      const counter = new Counter();
      expect(counter.decr('foo').get('foo')).to.equal(0);
      expect(counter.size).to.equal(0);
    });

    it('key which exists', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo').get('foo')).to.equal(1);
      expect(counter.size).to.equal(1);
    });

    it('deletes key if count was 1', () => {
      const counter = new Counter();
      expect(counter.incr('foo').decr('foo').get('foo')).to.equal(0);
      expect(counter.has('foo')).to.be.false;
      expect(counter.size).to.equal(0);
    });

    it('key with custom decrement = 0', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo', 0).get('foo')).to.equal(2);
    });

    it('key with custom decrement', () => {
      const counter = new Counter([['foo', 2]]);
      expect(counter.decr('foo', 2).get('foo')).to.equal(0);
      expect(counter.has('foo')).to.be.false;
    });

    it('rejects negative decrement', () => {
      const counter = new Counter();
      expect(() => counter.decr('foo', -1)).to.throw('Counter#decr only accepts positive values: -1');
    });
  });

  describe('#entries', () => {
    it('returns empty if counter has not element', () => {
      const counter = new Counter();
      expect([...counter.entries()]).to.be.empty;
    });

    it('returns elements', () => {
      const counter = new Counter([['foo', 2], ['bar', 3]]);
      counter.incr('baz', 3);
      expect([...counter.entries()]).to.deep.equal([
        ['foo', 2],
        ['bar', 3],
        ['baz', 3],
      ]);
    });
  });

  describe('#keys', () => {
    it('returns empty if counter has not element', () => {
      const counter = new Counter();
      expect([...counter.keys()]).to.be.empty;
    });

    it('returns keys', () => {
      const counter = new Counter([['foo', 2], ['bar', 3]]);
      counter.incr('baz', 3);
      expect([...counter.keys()]).to.deep.equal(['foo', 'bar', 'baz']);
    });
  });
});
