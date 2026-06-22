# dotnet-ddd — AI Agent Framework for .NET DDD Web APIs

An installable AI-developer framework specialized in building **.NET Web APIs with DDD /
Clean Architecture**, following the [`jino-labs/DotNet-WebApi-Template`](https://github.com/jino-labs/DotNet-WebApi-Template)
conventions (`dotnet new orgwebapi`).

It ships as a **Claude Code plugin** (via a plugin marketplace) plus **GitHub Copilot
instruction files**, so the same architecture rules apply in both tools. It does **not**
include the .NET solution itself — scaffold that from the `dotnet new` template; this repo
is the AI tooling that builds on top of it.

## What's inside

| Component | What it does |
|---|---|
| **Agents** | `ddd-architect`, `domain-modeler`, `api-application-builder`, `infrastructure-engineer`, `test-author` — layer-specialized subagents. |
| **Skills** | `/dotnet-ddd:new-feature`, `/dotnet-ddd:new-endpoint`, `/dotnet-ddd:add-migration`, `/dotnet-ddd:ddd-review`. |
| **Hooks** | A `UserPromptSubmit` hook injects relevant guidance when your prompt mentions GDPR/PII, DDD layers, EF Core migrations, JWT/auth, or testing. |
| **MCP** | `git` and `github` servers wired in `.mcp.json`. (dotnet/aspire CLIs are driven via Bash — no MCP server exists for them.) |
| **Copilot** | `.github/copilot-instructions.md` + path-scoped `.github/instructions/*.instructions.md`. |
| **`AGENTS.md`** | The canonical convention set every agent/tool defers to. |

## Install — Claude Code

From a clone of this repo (local-path marketplace):

```shell
/plugin marketplace add .
/plugin install dotnet-ddd@jino-dotnet-ddd
```

Or, once pushed to GitHub, by repo:

```shell
/plugin marketplace add jino-labs/AI-Agent-Framework
/plugin install dotnet-ddd@jino-dotnet-ddd
```

Try it: `/dotnet-ddd:new-feature Order`, or just mention "add an aggregate" and the agents
engage. `/agents` lists the five agents; `/mcp` shows git + github.

### Develop / test locally without installing

```shell
claude --plugin-dir ./plugins/dotnet-ddd
claude plugin validate ./plugins/dotnet-ddd
```

The `github` MCP server authenticates over OAuth on first use; the `git` server needs
[`uv`](https://docs.astral.sh/uv/) (`uvx`) on PATH. The keyword hook runs on `node` (always
present with Claude Code) — no other dependency.

## Install — GitHub Copilot

The Copilot files are auto-discovered when this repo (or these files) are present in the
workspace — no install step. `AGENTS.md` and `.github/copilot-instructions.md` apply
repo-wide; the `*.instructions.md` files apply to their matching layer via `applyTo` globs.

## Conventions

See [`AGENTS.md`](./AGENTS.md). In short: layered DDD with the dependency rule
`API → Application → Domain ← Infrastructure`, `Result` pattern, generic repository +
UnitOfWork, Mapster mapping, JWT/Identity auth, xUnit tests — mirror the `Product` aggregate.

## License

MIT — see [LICENSE](./LICENSE).
