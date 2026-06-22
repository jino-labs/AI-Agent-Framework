# EF Core migration reminder (auto-injected)

Migrations target the **Infrastructure** project (holds `ApplicationDbContext`) with the
**API** as startup project:

```
dotnet ef migrations add <Name> -p <*.Infrastructure.Data.Repositories> -s <*.API>
dotnet ef database update -p <*.Infrastructure.Data.Repositories> -s <*.API>
```

- Before adding a migration, ensure the entity has a `DbSet<>` in `ApplicationDbContext` and an `IEntityTypeConfiguration<T>` in `Configurations/`. Missing config → empty/wrong diff.
- Name migrations after the change (`Add_Order`, `Add_Product_Sku`), not a version.
- Review the generated `Up`/`Down` before applying — watch for unintended column drops / data loss.
- `dotnet ef database update` writes to a real database: confirm the target connection string / environment first.
- Migrations live in Infrastructure; the Domain and Application layers never reference them.
