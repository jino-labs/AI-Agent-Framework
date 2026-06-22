---
description: Create and apply an EF Core migration for a .NET DDD API, targeting the Infrastructure project with the API as startup. Use when the model changed and the database schema needs to follow.
---

# EF Core migration: $ARGUMENTS

Create (and optionally apply) an EF Core migration named after `$ARGUMENTS`. Follow `AGENTS.md`.

## Steps

1. **Confirm `dotnet-ef`** is available: `dotnet ef --version`. If missing: `dotnet tool install --global dotnet-ef`.
2. **Find projects:** the migrations project is `*.Infrastructure.Data.Repositories` (holds `ApplicationDbContext`); the startup project is `*.API`. Glob to get the real names.
3. **Check the model first:** ensure the entity has a `DbSet<>` in `ApplicationDbContext` and an `IEntityTypeConfiguration` in `Configurations/`. A migration over an unconfigured entity is the usual cause of a wrong/empty diff.
4. **Add the migration:**
   ```
   dotnet ef migrations add <Name> -p <Infrastructure.Data.Repositories> -s <API>
   ```
5. **Review the generated `Up`/`Down`** before applying — confirm it matches the intended schema change and isn't dropping data unexpectedly.
6. **Apply** when the user wants it (this writes to a database — confirm the target connection string/environment first):
   ```
   dotnet ef database update -p <Infrastructure.Data.Repositories> -s <API>
   ```

Name the migration after the change (`Add_Order`, `Add_Product_Sku`), not a version number.
