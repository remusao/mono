import { promises as fs } from 'fs';

import { parse, format } from '.';

(async () => {
  const msgRulesPath = process.argv[process.argv.length - 1];
  if (msgRulesPath.endsWith('/msgFilterRules.dat') === false) {
    console.error('usage: <program> <msgFilterRules.dat>');
    process.exit(1);
  }

  const msgRulesRaw = await fs.readFile(msgRulesPath, 'utf-8');
  const msgRules = parse(msgRulesRaw);
  const msgRulesStr = format(msgRules);

  console.log('Self-check', msgRulesRaw.trim() === msgRulesStr);
  console.log(JSON.stringify(msgRules, null, 2));
})();
