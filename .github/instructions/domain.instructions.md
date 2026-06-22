---
applyTo: "**/*.Domain.Entities/**,**/*.Domain.Contracts/**,**/*.Domain.Service/**"
---

# Domain layer

- Entities derive from `BaseEntity { int Id; DateTime CreatedAt; DateTime? UpdatedAt }`. Plain C# — no EF attributes, no data annotations, no DTO references.
- Domain depends on **nothing** outside Domain: no EF Core, no ASP.NET, no Mapster, no Application/Infrastructure types.
- Invariants live in domain services: interface in `*.Domain.Contracts/<Aggregate>/`, impl in `*.Domain.Service/<Aggregate>/`.
- Domain services **throw** `ArgumentException` on violated invariants (`ValidateForCreate`, `ValidateForUpdate`, `CanBeDeleted`); they do not return `Result`.
- Register new domain services in `*.Domain.Service/DependencyInjection.cs` (`AddDomainServices`).
- Mirror `Product` / `ProductDomainService`.
