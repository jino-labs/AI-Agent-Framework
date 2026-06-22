---
description: Scaffold a new aggregate/feature end-to-end across all DDD layers (Domain, Application, Infrastructure, Transversal, API) plus xUnit tests, mirroring the Product reference. Use when the user wants to add a new entity/use-case to a .NET DDD Web API.
---

# New DDD feature: $ARGUMENTS

Scaffold the aggregate named in `$ARGUMENTS` (e.g. `Order`) across every layer, following
the conventions in the repo's `AGENTS.md`. Use the existing `Product` aggregate as the
exact template — match namespaces, folder names, and code style.

## Steps

1. **Locate the solution.** Glob for `*.slnx`/`*.sln` and the `*.Domain.Entities` project to learn the real `Organization.ProjectName` prefix. Find the `Product` files to copy the pattern.
2. **Plan** with the `ddd-architect` agent (or inline): produce the ordered touch-list from `AGENTS.md` → "Adding a feature".
3. **Build, in dependency order:**
   - Domain: entity (`: BaseEntity`), `I<Name>DomainService` + `<Name>DomainService` (invariants), register in `AddDomainServices`.
   - Application: `<Name>Dto`/`Create<Name>Dto`/`Update<Name>Dto`, `I<Name>ApplicationService` + impl (returns `Result`/`Result<T>`, uses `IUnitOfWork`, `IMapper`), register in `AddApplicationServices`.
   - Infrastructure: `I<Name>Repository` + `<Name>Repository` (: `Repository<T>`), `<Name>Configuration`, `DbSet<>` in `ApplicationDbContext`, register in `AddInfrastructure`.
   - Transversal: `<Name>Mapping` (Mapster).
   - API: `<Name>sController` (thin, `Result` → `IActionResult`).
4. **Tests:** add xUnit tests in each `tests/unit-tests/*.Tests/<Name>/` mirroring `Product*Tests`.
5. **Migration:** `dotnet ef migrations add Add_<Name> -p <Infrastructure> -s <API>`.
6. **Verify:** `dotnet build` then `dotnet test`. Fix failures.

Ask which fields the entity has if `$ARGUMENTS` doesn't say. Keep each layer minimal — skip a
domain service only if the aggregate genuinely has no invariants.
