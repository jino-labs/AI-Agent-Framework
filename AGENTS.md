# .NET DDD Web API — Agent Conventions

Canonical conventions for building .NET Web APIs in this codebase. Derived from the
`jino-labs/DotNet-WebApi-Template` (`dotnet new orgwebapi`). Every AI agent — Claude
Code, GitHub Copilot, or otherwise — must follow these rules. Claude agents/skills and
Copilot instruction files all defer to this file as the source of truth.

## Architecture: layered DDD / Clean Architecture

Projects are named `Organization.ProjectName.<Layer>` (replace `Organization.ProjectName`
with the real solution name). Layers and their responsibilities:

| Layer | Project(s) | Holds |
|---|---|---|
| **API** | `*.API` | Controllers (attribute-routed, **not** minimal APIs), `Extensions/ServiceCollectionExtensions.cs`, `Program.cs`, Swagger + JWT wiring. No business logic. |
| **Application** | `*.Application.Contracts`, `*.Application.DTO`, `*.Application.Service` | Use-case orchestration. Contracts = service interfaces. DTO = request/response DTOs + `Result`/`Result<T>`. Service = implementations + `DependencyInjection.cs`. |
| **Domain** | `*.Domain.Contracts`, `*.Domain.Entities`, `*.Domain.Service` | Business core. Entities derive from `BaseEntity`. Domain services hold invariants/validation. Depends on **nothing**. |
| **Infrastructure** | `*.Infrastructure.Data.Contracts`, `*.Infrastructure.Data.Repositories` | EF Core, `ApplicationDbContext`, generic `Repository<T>`, `UnitOfWork`, entity `Configurations`, JWT (`IJwtTokenService`). |
| **Transversal** | `*.Transversal.Mapping` | Mapster mappings (`IMapper`). |
| **Tests** | `tests/unit-tests/*.Tests` | xUnit project per layer, mirrors structure. |

### Dependency rule (enforce in every change)

```
API ──> Application ──> Domain <── Infrastructure
                          ^
              Transversal (mapping) ──┘
```

- **Domain depends on nothing.** No EF Core, no ASP.NET, no DTOs in Domain.
- Application depends on Domain contracts + Infrastructure contracts (interfaces only).
- Infrastructure implements `*.Infrastructure.Data.Contracts` and references Domain entities.
- API depends on Application; it never touches Infrastructure or Domain entities directly.
- Reference an interface, never a concrete class across layers. Wire concretes in each layer's `DependencyInjection.cs` / `ServiceCollectionExtensions`.

## Stack

.NET · EF Core · ASP.NET Core Identity · JWT (HS256) · **Mapster** (`MapsterMapper.IMapper`)
· Swagger/OpenAPI · xUnit. Solution file is `.slnx`.

## Coding conventions

- **Result pattern.** Application services return `Result` / `Result<T>` (`Application.DTO/Common/Result.cs`) — never throw for expected failures (not-found, validation). `Result<T>.Ok(data)` / `Result.Fail("message")`.
- **Domain validation throws.** Domain services throw `ArgumentException` for invariant violations (e.g. `ValidateForCreate`). Application catches/guards and converts to `Result.Fail` where appropriate.
- **Entities**: derive from `BaseEntity { int Id; DateTime CreatedAt; DateTime? UpdatedAt }`. Set `UpdatedAt = DateTime.UtcNow` on update.
- **Repositories**: generic `Repository<T> where T : BaseEntity` for CRUD; per-aggregate interface (e.g. `IProductRepository : IRepository<Product>`) for queries beyond CRUD. Reads use `AsNoTracking()`.
- **UnitOfWork**: persistence is committed by `IUnitOfWork.SaveChangesAsync(ct)` in the application service, not inside the repository.
- **Async + cancellation**: every async method takes `CancellationToken ct = default` and forwards it.
- **DI**: constructor injection only. Each layer exposes one registration method (`AddApplicationServices`, `AddDomainServices`, `AddInfrastructure`, `AddMapping`).
- **Mapping**: entity↔DTO conversions live in `*.Transversal.Mapping` via Mapster; do not hand-map in services.
- **API controllers**: thin — call the application service, translate `Result` to `IActionResult` (`Ok`, `NotFound`, `BadRequest`). No EF/domain logic.

## Adding a feature (aggregate) — touch order

To add aggregate `Foo`, mirror the `Product` reference across layers:

1. `Domain.Entities/Foo/Foo.cs` (`: BaseEntity`).
2. `Domain.Contracts/Foo/IFooDomainService.cs` + `Domain.Service/Foo/FooDomainService.cs` (invariants).
3. `Application.DTO/Foo/{FooDto,CreateFooDto,UpdateFooDto}.cs`.
4. `Application.Contracts/Foo/IFooApplicationService.cs` + `Application.Service/Foo/FooApplicationService.cs`.
5. `Infrastructure.Data.Contracts/Foo/IFooRepository.cs` + `Infrastructure.Data.Repositories/Repositories/FooRepository.cs` + `Configurations/FooConfiguration.cs`; add `DbSet<Foo>` to `ApplicationDbContext`.
6. `Transversal/Mappings/FooMapping.cs`.
7. `API/Controllers/FoosController.cs`.
8. Register in each `DependencyInjection.cs`.
9. Tests in each `tests/unit-tests/*.Tests/Foo/` project.
10. EF migration: `dotnet ef migrations add Add_Foo -p <Infrastructure.Data.Repositories> -s <API>`.

## Data protection / GDPR

When an entity holds personal data (PII): minimize fields, never log PII, support
erasure/anonymization, and gate access behind authorization. See the plugin's
`hooks/context/gdpr.md` for the full checklist (auto-injected when GDPR is mentioned).
