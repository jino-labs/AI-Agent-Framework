---
description: Review a diff or set of files in a .NET DDD API for layer-boundary and dependency-rule violations, Result/validation misuse, and convention drift. Use for "review this for DDD/architecture issues".
---

# DDD architecture review: $ARGUMENTS

Review the current diff (or the files/scope in `$ARGUMENTS`) against `AGENTS.md`. Report
problems only — one line each, location + issue + fix. No praise, no style nits that don't
change meaning.

## Check for

- **Dependency-rule breaks:** Domain referencing EF Core / ASP.NET / DTOs / other layers; API touching Infrastructure or Domain entities; a layer depending on a concrete instead of an interface.
- **Layer leakage:** business logic in controllers; persistence logic in application services; validation in the wrong layer (invariants belong in the domain service).
- **Result pattern:** application services throwing for not-found/validation instead of returning `Result.Fail`; domain services returning `Result` instead of throwing.
- **Persistence:** `SaveChangesAsync` called inside a repository instead of via `IUnitOfWork`; reads not using `AsNoTracking()`.
- **Async:** missing `CancellationToken` parameter or not forwarding it.
- **DI:** new service/repo not registered in the layer's `DependencyInjection.cs`/`ServiceCollectionExtensions`.
- **Mapping:** hand-mapping entity↔DTO instead of Mapster in Transversal.
- **Tests:** new behavior with no xUnit coverage in the matching layer test project.
- **PII/GDPR:** personal data logged, not minimized, or missing erasure/authorization (see `hooks/context/gdpr.md`).

Get the diff with `git diff` if no scope is given. End with a short pass/fail verdict.
