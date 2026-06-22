#!/usr/bin/env node
// UserPromptSubmit hook: scan the prompt for keywords and inject the matching context
// snippet(s) as additionalContext. Node (not jq/bash) so it runs anywhere Claude Code does.
// ponytail: fixed keyword->file table; move to a config file only if it outgrows this list.
'use strict';
const fs = require('fs');
const path = require('path');

const CTX = path.join(__dirname, 'context');
const MAP = [
  [/gdpr|data protection|personal data|\bpii\b|consent|right to erasure/, 'gdpr.md'],
  [/\bddd\b|aggregate|bounded context|domain service|value object|clean architecture|layer/, 'ddd-layers.md'],
  [/migration|ef core|dbcontext|\bmigrate\b|database update/, 'efcore-migrations.md'],
  [/\bjwt\b|\bauth\b|identity|login|bearer token|authentication/, 'auth-jwt.md'],
  [/\btest\b|xunit|unit test|coverage|\bmock\b/, 'testing.md'],
];

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = String(JSON.parse(raw).prompt || '').toLowerCase(); } catch { process.exit(0); }

  let blob = '';
  for (const [re, file] of MAP) {
    if (re.test(prompt)) {
      const f = path.join(CTX, file);
      if (fs.existsSync(f)) blob += fs.readFileSync(f, 'utf8') + '\n\n';
    }
  }
  if (!blob) process.exit(0); // nothing matched -> add no context

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: blob },
  }));
  process.exit(0);
});
