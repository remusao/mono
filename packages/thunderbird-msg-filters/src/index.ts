const ActionNames = [
  'AddTag',
  'Change priority',
  'Copy to folder',
  'Custom',
  'Delete from Pop3 server',
  'Delete',
  'Fetch body from Pop3Server',
  'Forward',
  'Ignore subthread',
  'Ignore thread',
  'JunkScore',
  'Label',
  'Leave on Pop3 server',
  'Mark flagged',
  'Mark read',
  'Mark unread',
  'Move to folder',
  'Reply',
  'Stop execution',
  'Watch thread',
] as const;

// TODO - split in two types
interface Action {
  name: typeof ActionNames[number];
  value?: string;
}

interface Rule {
  name: string;
  enabled: 'yes' | 'no';
  type: '17' | '145'; // TODO - understand meaning of 'type'
  actions: Action[];
  condition: string; // TODO - parse conditions? 'ALL', 'OR', 'AND'
}

interface Rules {
  version: '9';
  logging: 'yes' | 'no';
  rules: Rule[];
}

export function format(msgRules: Rules): string {
  const lines: string[] = [
    `version="${msgRules.version}"`,
    `logging="${msgRules.logging}"`,
  ];

  for (const rule of msgRules.rules) {
    lines.push(`name="${rule.name}"`);
    lines.push(`enabled="${rule.enabled}"`);
    lines.push(`type="${rule.type}"`);
    for (const action of rule.actions) {
      lines.push(`action="${action.name}"`);
      if (action.value !== undefined) {
        lines.push(`actionValue="${action.value}"`);
      }
    }
    lines.push(`condition="${rule.condition}"`);

  }

  return lines.join('\n');
}

function normalizeValue(value: string): string {
  if (value.startsWith('"')) {
    value = value.slice(1);
  }

  if (value.endsWith('"')) {
    value = value.slice(0, value.length - 1);
  }

  return value;
}

export function parse(msgRulesRaw: string): Rules {
  const error = (line: number, msg: string): void => {
    console.error(`${line}: ${msg}`);
  };

  // Parse rules!
  const lines = msgRulesRaw.split(/[\n\r]+/g).filter(l => l.trim().length !== 0);
  if (lines.length < 1 || lines[0].startsWith('version=') === false) {
    error(1, 'msgFilterRules.dat should specify a version.');
    process.exit(1);
  }

  const version = normalizeValue(lines[0].slice(8));
  if (version !== '9') {
    error(1, `msgFilterRules.dat version not supported, should be "9" but found "${version}".`);
    process.exit(1);
  }

  if (lines.length < 2 || lines[1].startsWith('logging=') === false) {
    error(2, 'msgFilterRules.dat logging level should be specified.');
    process.exit(1);
  }

  const logging = normalizeValue(lines[1].slice(8));
  if (logging !== 'yes' && logging !== 'no') {
    error(
      2, `msgFilterRules.dat logging value is not valid, should be "yes" or "no" but found "${logging}".`,
    );
    process.exit(1);
  }

  const msgRules: Rules = {
    version,
    logging,
    rules: [],
  };

  // Create an empty parser's state.
  const newState = (): {
    startLine: number | undefined;

    unparseable: boolean;
    name: undefined | Rule['name'];
    enabled: undefined | Rule['enabled'];
    type: undefined | Rule['type'];
    condition: undefined | Rule['condition'];

    actionName: undefined | Action['name'];
    actionValue: undefined | Action['value'];

    actions: Rule['actions'];
  } => ({
    startLine: undefined,

    unparseable: false,
    name: undefined,
    enabled: undefined,
    type: undefined,
    condition: undefined,

    actionName: undefined,
    actionValue: undefined,

    actions: [],
  });

  // Parser's state.
  let state = newState();

  const flushAction = () => {
    // Push previous action if any
    if (state.actionName !== undefined) {
      if (state.actionName !== undefined) {
        state.actions.push({
          name: state.actionName,
          value: state.actionValue,
        });
      }

      state.actionName = undefined;
      state.actionValue = undefined;
    }
  };

  const flushRule = () => {
    if (state.unparseable === true) {
      error(state.startLine || 0, 'drop unparseable rule');
      return;
    }

    if (state.name === undefined) {
      error(state.startLine || 0, '"name" was not specified');
      return;
    }

    if (state.enabled === undefined) {
      error(state.startLine || 0, '"enabled" was not specified');
      return;
    }

    if (state.type === undefined) {
      error(state.startLine || 0, '"type" was not specified');
      return;
    }

    if (state.condition === undefined) {
      error(state.startLine || 0, '"condition" was not specified');
      return;
    }

    flushAction();
    if (state.actions.length === 0) {
      error(state.startLine || 0, 'no action was specified');
      return;
    }

    msgRules.rules.push({
      name: state.name,
      enabled: state.enabled,
      type: state.type,
      actions: state.actions,
      condition: state.condition,
    });

  };

  for (let i = 2; i < lines.length; i += 1) {
    const line = lines[i];

    // Parse <tag>=<value>
    const indexOfEqual = line.indexOf('=');
    if (indexOfEqual === -1) {
      error(i + 1, `ignore invalid line "${line}"`);
      continue;
    }

    const tag = line.slice(0, indexOfEqual);
    const value = normalizeValue(line.slice(indexOfEqual + 1));

    switch (tag) {
      case 'name': {
        // If we already have a name set then it means we are done parsing the
        // previous rule. We push the rule (making sure that it's valid) and
        // reset parser's internal state.
        if (state.name !== undefined) {
          flushRule();
          state = newState();
        }

        state.name = value;
        break;
      }
      case 'enabled': {
        if (value !== 'yes' && value !== 'no') {
          error(i + 1, `invalid value for "enabled", expected "yes" or "no" but got ${value}`);
          state.unparseable = true;
          break;
        }

        state.enabled = value;
        break;
      }
      case 'type': {
        if (value !== '17' && value !== '145') {
          error(i + 1, `invalid value for "type", expected "17" or "145" but got ${value}`);
          state.unparseable = true;
          break;
        }

        state.type = value;
        break;
      }
      case 'action': {
        // If there is already an action being parsed then we need to push it
        // and reset the internal parser's state.
        flushAction();

        // @ts-ignore
        state.actionName = value;
        break;
      }
      case 'actionValue': {
        // Make sure that there is no other rule action being parsed.
        if (state.actionValue !== undefined) {
          error(i + 1, `action value was specified with no name`);
          state.unparseable = true;
          break;
        }

        state.actionValue = value;
        break;
      }
      case 'condition': {
        // Make sure that there is no other rule condition being parsed.
        if (state.condition !== undefined) {
          error(i + 1, `condition was specified twice for rule`);
          state.unparseable = true;
          break;
        }

        state.condition = value;
        break;
      }
      default: {
        error(i + 1, `unknown tag "${line}"`);
        state.unparseable = true;
        // TODO - unknown tag.
      }
    }
  }

  // Make sure we flush the last parsed rule, if any.
  flushRule();

  return msgRules;
}
