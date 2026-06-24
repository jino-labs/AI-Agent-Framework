#!/usr/bin/env node
// UserPromptSubmit hook: scan the prompt for keywords and inject the matching context
// snippet(s) as additionalContext. Node (not jq/bash) so it runs anywhere Claude Code does.
// ponytail: fixed keyword->file table; move to a config file only if it outgrows this list.
'use strict';
const fs = require('fs');
const path = require('path');

const CTX = path.join(__dirname, 'context');
const MAP = [
  [/\broute\b|\bpage\b|routing|navigation|middleware|layout|\bdirectory\b|file-based|\bapp\/\b/, 'nuxt-structure.md'],
  [/usefetch|useasyncdata|\$fetch|data fetch|data-fetch|server route|api route|nitro/, 'data-fetching.md'],
  [/\bssr\b|\bssg\b|\bspa\b|prerender|pre-render|hybrid|routerules|route rules|\brender\b|isr|swr/, 'rendering.md'],
  [/usestate|pinia|\bstate\b|composable|\bstore\b|provide\/inject/, 'state.md'],
  [/nuxt ui|@nuxt\/ui|component library|\buapp\b|ubutton|\btheme\b|tailwind|app\.config/, 'nuxt-ui.md'],
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
