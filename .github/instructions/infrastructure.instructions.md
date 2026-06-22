---
applyTo: "**/*.Infrastructure.Data.Contracts/**,**/*.Infrastructure.Data.Repositories/**"
---

# Infrastructure layer

- Generic `Repository<T> where T : BaseEntity` for CRUD; per-aggregate `I<Name>Repository : IRepository<T>` for extra queries, implemented in `Repositories/`.
- Reads use `AsNoTracking()`. Repositories add/update/remove on the `DbSet` but **do not** call `SaveChanges` — persistence commits via `IUnitOfWork.SaveChangesAsync(ct)`.
- EF mapping in `Configurations/<Name>Configuration.cs` (`IEntityTypeConfiguration<T>`); add a `DbSet<T>` to `ApplicationDbContext` and apply the configuration.
- JWT: `IJwtTokenService` + `JwtSettings` (HS256), signing key from configuration, never hard-coded or logged.
- Register repos/UoW/DbContext in `DependencyInjection.cs` (`AddInfrastructure`).
- Migrations target this project with the API as startup: `dotnet ef migrations add <Name> -p <this> -s <*.API>`.
- Every async method takes `CancellationToken ct = default`. Mirror `ProductRepository` / `ProductConfiguration`.
