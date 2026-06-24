#!/usr/bin/env node
// PreToolUse security guard. Runs before EVERY tool call (Bash/Write/Edit/Read/...).
// Blocks two classes of abuse a malicious plugin/prompt could attempt:
//   1. Filesystem escape  -> writing/reading outside the project "safe root"
//      (e.g. ~/.ssh, ~/.claude, shell profiles, system dirs).
//   2. Unsafe code exec   -> dangerous shell (curl|sh, rm -rf /, reverse shells,
//      Invoke-Expression, fork bombs, secret exfil, registry run-keys ...).
// On a hit it prints a loud red banner to stderr AND returns permissionDecision:"deny",
// so Claude Code refuses the call and the user sees exactly what was stopped.
//
// Node (not bash/jq) so it runs anywhere Claude Code does — same dep as inject-context.js.
// Optional override file: ${CLAUDE_PROJECT_DIR}/.claude/security-policy.json
//   { "allowPaths": ["abs or repo-relative ..."], "denyCommandPatterns": ["regex", ...] }
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

// ---- helpers ---------------------------------------------------------------
const norm = (p) => path.resolve(p).replace(/\\/g, '/').toLowerCase();
const home = norm(os.homedir());

function readInput(cb) {
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    try { cb(JSON.parse(raw)); } catch { process.exit(0); } // unparseable -> don't block
  });
}

function loadPolicy(projectDir) {
  try {
    const f = path.join(projectDir, '.claude', 'security-policy.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8')) || {};
  } catch { /* ignore malformed policy, fall back to defaults */ }
  return {};
}

// ---- block: filesystem escape ---------------------------------------------
// Sensitive locations that must never be touched even if "inside" the root.
const SENSITIVE = [
  /\/\.ssh(\/|$)/, /\/\.aws(\/|$)/, /\/\.gnupg(\/|$)/, /\/\.claude(\/|$)/,
  /\/\.config\/(gh|git)(\/|$)/, /\.bashrc$/, /\.zshrc$/, /\.profile$/,
  /\/\.npmrc$/, /\/\.netrc$/, /id_rsa/, /id_ed25519/, /\.pem$/,
  /\/etc\//, /\/boot\//, /\/system32\//, /\/windows\//,
  /\/appdata\/roaming\/(npm|claude)/,
];

function pathVerdict(file, root, allow) {
  if (!file) return null;
  const target = norm(file);
  for (const re of SENSITIVE) {
    if (re.test(target)) return `sensitive location: ${file}`;
  }
  const ok = [root, ...allow].some((base) => target === base || target.startsWith(base + '/'));
  if (!ok) return `path is outside the project safe root: ${file}`;
  return null;
}

// ---- block: unsafe shell ---------------------------------------------------
const DANGER = [
  [/\brm\s+-[a-z]*r[a-z]*f?\s+(\/|~|\$home|\.\.)/i, 'recursive delete of root/home/parent'],
  [/\b(curl|wget|iwr|invoke-webrequest)\b[^|]*\|\s*(sudo\s+)?(sh|bash|zsh|pwsh|powershell|python|node)/i, 'pipe remote download straight into an interpreter'],
  [/\b(iex|invoke-expression)\b/i, 'PowerShell Invoke-Expression (arbitrary code eval)'],
  [/\b(base64\s+-d|frombase64string)\b[^|]*\|\s*(sh|bash|pwsh|powershell)/i, 'decode-and-execute payload'],
  [/\b(nc|ncat|netcat)\b.*\s-e\b/i, 'netcat reverse shell'],
  [/\/dev\/tcp\//i, 'bash /dev/tcp reverse shell'],
  [/:\(\)\s*\{\s*:\|:&\s*\}\s*;\s*:/, 'fork bomb'],
  [/\bchmod\s+(-R\s+)?0?777\b/i, 'world-writable chmod 777'],
  [/(set-itemproperty|reg\s+add)\b.*\\run\b/i, 'registry Run-key persistence'],
  [/\b(cat|type|gc|get-content)\b.*(\.ssh\/|id_rsa|id_ed25519|\.aws\/credentials|\.env\b)/i, 'reading secret/credential files'],
  [/\b(printenv|env|get-childitem\s+env:)\b.*\|\s*(curl|wget|nc|ncat)/i, 'exfiltrating environment variables'],
  [/\b(history\s+-c|rm\s+.*\.bash_history|clear-history)\b/i, 'wiping shell history (anti-forensics)'],
];

function commandVerdict(cmd, extraDeny) {
  if (!cmd) return null;
  for (const [re, why] of DANGER) if (re.test(cmd)) return why;
  for (const pat of extraDeny) {
    try { if (new RegExp(pat, 'i').test(cmd)) return `matched policy deny pattern: ${pat}`; } catch { /* bad regex */ }
  }
  return null;
}

// ---- loud banner -----------------------------------------------------------
function banner(tool, reason) {
  const R = '\x1b[1;37;41m', X = '\x1b[0m'; // bold white on red
  const lines = [
    '',
    `${R}  ╔══════════════════════════════════════════════════════════════╗  ${X}`,
    `${R}  ║   🛑  SECURITY GUARD BLOCKED A TOOL CALL  🛑                    ║  ${X}`,
    `${R}  ╚══════════════════════════════════════════════════════════════╝  ${X}`,
    `   tool   : ${tool}`,
    `   reason : ${reason}`,
    `   policy : dotnet-ddd security-guard (PreToolUse hook)`,
    '',
  ];
  process.stderr.write(lines.join('\n') + '\n');
}

// ---- main ------------------------------------------------------------------
readInput((input) => {
  const tool = input.tool_name || '';
  const ti = input.tool_input || {};
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const root = norm(projectDir);
  const policy = loadPolicy(projectDir);
  const allow = (policy.allowPaths || []).map((p) =>
    path.isAbsolute(p) ? norm(p) : norm(path.join(projectDir, p)));
  // system temp is always allowed (build artifacts, scratch files)
  allow.push(norm(os.tmpdir()));

  let reason = null;

  if (tool === 'Bash') {
    reason = commandVerdict(ti.command, policy.denyCommandPatterns || []);
  } else if (tool === 'Read' || tool === 'Write' || tool === 'Edit' || tool === 'NotebookEdit') {
    // Reads of project files are fine; only guard escapes. Writes/edits guarded too.
    reason = pathVerdict(ti.file_path || ti.notebook_path, root, allow);
  } else if (tool === 'MultiEdit') {
    reason = pathVerdict(ti.file_path, root, allow);
  }

  if (!reason) process.exit(0); // allow

  banner(tool, reason);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Blocked by dotnet-ddd security-guard: ${reason}`,
    },
  }));
  process.exit(0);
});
