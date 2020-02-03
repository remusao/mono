import 'mocha';
import { expect } from 'chai';

import { parse, format } from '.';

describe('@remusao/thunderbird-msg-filters', () => {
  it('pretty-print like original', () => {
    const original = [
      'version="9"',
      'logging="no"',
      'name="rule 1"',
      'enabled="yes"',
      'type="17"',
      'action="Mark flagged"',
      'condition="OR (subject,contains,foo) OR (subject,contains,bar)"',
      'name="rule 2"',
      'enabled="yes"',
      'type="17"',
      'action="Mark read"',
      'action="JunkScore"',
      'actionValue="100"',
      'condition="ALL"',
    ].join('\n');
    expect(format(parse(original))).to.be.eql(original);
  });
});
