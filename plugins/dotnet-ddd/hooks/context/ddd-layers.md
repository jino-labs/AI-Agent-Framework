# DDD layering reminder (auto-injected)

This codebase is a layered DDD / Clean Architecture .NET Web API. Respect the dependency rule:

```
API ──> Application ──> Domain <── Infrastructure
                          ^
              Transversal (mapping) ──┘
```

- **Domain** (`*.Domain.Entities`, `*.Domain.Contracts`, `*.Domain.Service`): entities derive from `BaseEntity`; domain services hold invariants and **throw** on violation. Depends on nothing.
- **Application** (`*.Application.Contracts`, `*.Application.DTO`, `*.Application.Service`): orchestrates use-cases; services return `Result`/`Result<T>`; commit via `IUnitOfWork`; map via Mapster `IMapper`.
- **Infrastructure** (`*.Infrastructure.Data.Contracts`, `*.Infrastructure.Data.Repositories`): EF Core, generic `Repository<T>`, `UnitOfWork`, `ApplicationDbContext`, `Configurations`, JWT.
- **API** (`*.API`): thin attribute-routed controllers; translate `Result` → `IActionResult`. No business logic, no entities.
- **Transversal** (`*.Transversal.Mapping`): Mapster entity↔DTO mappings.

Cross-layer references go through interfaces only; register concretes in each layer's
`DependencyInjection.cs` / `ServiceCollectionExtensions`. Mirror the `Product` aggregate.
Domain must never reference EF Core, ASP.NET, DTOs, or any other layer.
