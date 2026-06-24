# Copilot instructions — AI Agent Framework

This repository is an AI-developer framework covering two domains:

- **Backend** — **.NET Web APIs using layered DDD / Clean Architecture** (`jino-labs/DotNet-WebApi-Template` conventions). Full ruleset in [`AGENTS.md`](../AGENTS.md); the short version is below.
- **Frontend** — **Nuxt 4 + Nuxt UI v4** (universal SSR, `app/` structure). Full ruleset in [`NUXT.md`](../NUXT.md); short version in [`.github/instructions/nuxt-frontend.instructions.md`](instructions/nuxt-frontend.instructions.md) (applies to `.vue`/`nuxt.config`/`app/`/`server/` files).

Per-layer detail for both lives in `.github/instructions/*.instructions.md`, scoped by `applyTo`. The rest of this file is the .NET backend short version.

## .NET DDD Web API

## Architecture

Projects are `Organization.ProjectName.<Layer>`. Dependency rule:

```
API ──> Application ──> Domain <── Infrastructure   (Transversal = Mapster mapping)
```

- **Domain** depends on nothing — no EF Core, ASP.NET, or DTOs. Entities derive from `BaseEntity`; domain services hold invariants and **throw**.
- **Application** orchestrates use-cases; services return `Result`/`Result<T>`, commit via `IUnitOfWork`, map via Mapster `IMapper`.
- **Infrastructure** is EF Core: generic `Repository<T>`, `UnitOfWork`, `ApplicationDbContext`, `Configurations`, JWT.
- **API** has thin attribute-routed controllers (not minimal APIs) that translate `Result` → `IActionResult`.

## Conventions

- Result pattern for expected failures; never throw across the application boundary for not-found/validation.
- Cross-layer references via interfaces only; register concretes in each layer's `DependencyInjection.cs` / `ServiceCollectionExtensions`.
- Every async method takes `CancellationToken ct = default` and forwards it; reads use `AsNoTracking()`.
- Mirror the existing `Product` aggregate when adding features.
- Stack: EF Core, ASP.NET Identity, JWT (HS256), Mapster, Swagger, xUnit.
- Never log PII, tokens, or secrets. For personal data, apply data minimization and support erasure.
