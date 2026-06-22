# Copilot instructions — .NET DDD Web API

This repository builds **.NET Web APIs using layered DDD / Clean Architecture**, following
the `jino-labs/DotNet-WebApi-Template` conventions. The full ruleset lives in
[`AGENTS.md`](../AGENTS.md) (Copilot also reads it automatically) — this file is the short
version; per-layer detail is in `.github/instructions/*.instructions.md`.

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
