# AI Agent Framework

An installable AI-developer framework that ships as **Claude Code plugins** (via a plugin
marketplace) plus **GitHub Copilot instruction files**, so the same conventions apply in both
tools. It contains two plugins:

| Plugin | Domain | Conventions |
|---|---|---|
| **`dotnet-ddd`** | **.NET Web APIs with DDD / Clean Architecture**, following the [`jino-labs/DotNet-WebApi-Template`](https://github.com/jino-labs/DotNet-WebApi-Template) (`dotnet new orgwebapi`). | [`AGENTS.md`](./AGENTS.md) |
| **`nuxt-frontend`** | **Nuxt 4 + Nuxt UI v4 frontends** — universal SSR, `app/` structure, file-based routing, Nitro `server/` API. | [`NUXT.md`](./NUXT.md) |

It does **not** include an application solution itself — scaffold .NET from the `dotnet new`
template and Nuxt from `npm create nuxt@latest`; this repo is the AI tooling that builds on top.

## `dotnet-ddd` plugin

| Component | What it does |
|---|---|
| **Agents** | `ddd-architect`, `domain-modeler`, `api-application-builder`, `infrastructure-engineer`, `test-author` — layer-specialized subagents. |
| **Skills** | `/dotnet-ddd:new-feature`, `/dotnet-ddd:new-endpoint`, `/dotnet-ddd:add-migration`, `/dotnet-ddd:ddd-review`. |
| **Hooks** | A `UserPromptSubmit` hook injects relevant guidance (GDPR/PII, DDD layers, EF Core migrations, JWT/auth, testing). A **`PreToolUse` security guard** runs before every Bash/Write/Edit/Read call and blocks anything that escapes the project safe root or runs unsafe code (see below). |
| **MCP** | `git` and `github` servers wired in `.mcp.json`. (dotnet/aspire CLIs are driven via Bash — no MCP server exists for them.) |
| **Copilot** | `.github/copilot-instructions.md` + path-scoped `.github/instructions/*.instructions.md`. |
| **`AGENTS.md`** | The canonical convention set every agent/tool defers to. |

## `nuxt-frontend` plugin

Targets **Nuxt `^4.4`** + **Nuxt UI `^4.9`** (the unified free `@nuxt/ui` on Tailwind v4),
Node 22+. Default posture is universal SSR with a Nitro `server/` API layer.

| Component | What it does |
|---|---|
| **Agents** | `nuxt-frontend-architect` (plans features across the app/server/shared boundary, enforces structure & rendering), `nuxt-component-builder` (writes pages/components/composables/server routes with Nuxt UI). |
| **Skills** | `/nuxt-frontend:nuxt-architecture`, `/nuxt-frontend:new-page`, `/nuxt-frontend:new-component`, `/nuxt-frontend:nuxt-ui`, `/nuxt-frontend:nuxt-review`. |
| **Hooks** | Same `UserPromptSubmit` context-injection (Nuxt structure, data fetching, rendering modes, state, Nuxt UI) + the shared `PreToolUse` security guard. |
| **MCP** | `git` and `github` servers wired in `.mcp.json`. |
| **Copilot** | `.github/instructions/nuxt-frontend.instructions.md` (scoped to `.vue`/`nuxt.config`/`app/`/`server/`). |
| **`NUXT.md`** | The canonical Nuxt convention set every agent/tool defers to. |

## Install — Claude Code

From a clone of this repo (local-path marketplace):

```shell
/plugin marketplace add .
/plugin install dotnet-ddd@jino-dotnet-ddd
/plugin install nuxt-frontend@jino-dotnet-ddd
```

Or, once pushed to GitHub, by repo:

```shell
/plugin marketplace add jino-labs/AI-Agent-Framework
/plugin install dotnet-ddd@jino-dotnet-ddd
/plugin install nuxt-frontend@jino-dotnet-ddd
```

Install whichever plugins you need — they're independent. Try it: `/dotnet-ddd:new-feature Order`
or `/nuxt-frontend:new-page Dashboard`, or just mention "add an aggregate" / "add a Nuxt page"
and the agents engage. `/agents` lists the installed agents; `/mcp` shows git + github.

### Develop / test locally without installing

```shell
claude --plugin-dir ./plugins/dotnet-ddd      # or ./plugins/nuxt-frontend
claude plugin validate ./plugins/dotnet-ddd
claude plugin validate ./plugins/nuxt-frontend
```

The `github` MCP server authenticates over OAuth on first use; the `git` server needs
[`uv`](https://docs.astral.sh/uv/) (`uvx`) on PATH. The keyword hook runs on `node` (always
present with Claude Code) — no other dependency.

## Install — GitHub Copilot

The Copilot files are auto-discovered when this repo (or these files) are present in the
workspace — no install step. `AGENTS.md`, `NUXT.md`, and `.github/copilot-instructions.md`
apply repo-wide; the `*.instructions.md` files apply to their matching layer/framework via
`applyTo` globs (`.NET` layers and `.vue`/`nuxt.config`/`app/`/`server/`).

## Security guard

Each plugin ships the same `hooks/security-guard.js`, run as a `PreToolUse` hook on `Bash`,
`Write`, `Edit`, `MultiEdit`, `Read`, and `NotebookEdit`. It **denies** the call (Claude Code
refuses it) and prints a loud red banner when it detects:

- **Filesystem escape** — a write/edit/read whose path leaves the project root, or touches
  a sensitive location (`~/.ssh`, `~/.aws`, `~/.claude`, shell profiles, `id_rsa`, `/etc`,
  `system32`, …). The system temp dir is always allowed.
- **Unsafe code execution** — `curl|sh` / decode-and-run pipelines, `rm -rf /`,
  `Invoke-Expression`, netcat/`/dev/tcp` reverse shells, fork bombs, `chmod 777`,
  registry Run-key persistence, reading credential files, env-var exfil, history wiping.

So a malicious plugin or prompt that tries to break out of safe paths or run unsafe
commands is stopped automatically, with an unmissable on-screen warning.

**Extend / tune** (optional) — drop `.claude/security-policy.json` in your project root:

```json
{
  "allowPaths": ["../shared-libs", "C:/build/output"],
  "denyCommandPatterns": ["my-internal-secret-tool"]
}
```

`allowPaths` widens the safe root (repo-relative or absolute); `denyCommandPatterns` are
extra case-insensitive regexes to block. Test it:
`node plugins/<plugin>/hooks/security-guard.test.js`.

## Conventions

- **.NET** — [`AGENTS.md`](./AGENTS.md): layered DDD with the dependency rule
  `API → Application → Domain ← Infrastructure`, `Result` pattern, generic repository +
  UnitOfWork, Mapster mapping, JWT/Identity auth, xUnit — mirror the `Product` aggregate.
- **Nuxt** — [`NUXT.md`](./NUXT.md): Nuxt 4 `app/` structure with the `app`/`server`/`shared`
  boundary, universal SSR + `routeRules`, `useFetch`/`$fetch` data fetching, `useState`/Pinia
  state, Nuxt UI v4 (`<UApp>`, `app.config.ts` theming) — `<script setup lang="ts">` throughout.

## License

MIT — see [LICENSE](./LICENSE).
