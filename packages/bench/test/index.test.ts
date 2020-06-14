import { expect } from 'chai';
import 'mocha';

import bench from '../index';

it('@remusao/bench', () => {
  const inputs: string[] = ['foo', 'bar', 'baz'];
  const seen: Set<string> = new Set();

  const opsPerSecond = bench((str: string) => {
    seen.add(str);
  }, inputs);

  expect(opsPerSecond).to.be.a('number');
  expect(opsPerSecond).to.be.greaterThan(0);
  expect(seen).to.eql(new Set(inputs));
});
