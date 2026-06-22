---
description: Add a new endpoint/action to an existing aggregate's controller and application service in a .NET DDD API, without scaffolding a whole new aggregate. Use for "add a GET/POST/search/... to the X API".
---

# New endpoint: $ARGUMENTS

Add the operation described in `$ARGUMENTS` (e.g. "search Products by name") to an existing
aggregate. Follow `AGENTS.md`.

## Steps

1. Identify the target aggregate and open its `*ApplicationService`, `*Controller`, and repo interface.
2. **Application contract + service:** add the method to `I<Name>ApplicationService` and implement it, returning `Result`/`Result<T>`, with `CancellationToken ct = default`.
3. **Repository (only if a new query is needed):** add the method to `I<Name>Repository` and implement it in `<Name>Repository` (`AsNoTracking()` for reads). Do not add CRUD that the generic `Repository<T>` already covers.
4. **DTOs:** add request/response DTOs in `*.Application.DTO/<Name>/` if the shape is new; map via Mapster in Transversal, not inline.
5. **Controller:** add the thin action, route it consistently with the other endpoints, translate `Result` → `IActionResult`, keep authorization consistent.
6. **Tests:** extend the application + controller test classes for the new behavior.
7. **Verify:** `dotnet build` and `dotnet test`.

No domain change unless the operation introduces a new invariant — if it does, put it in the domain service, not the application service.
