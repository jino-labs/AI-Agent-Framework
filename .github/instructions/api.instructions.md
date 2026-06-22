---
applyTo: "**/*.API/**"
---

# API layer

- Attribute-routed **controllers**, not minimal APIs. Controllers are thin: call the application service, translate `Result` → `IActionResult` (`Ok`/`NotFound`/`BadRequest`/`CreatedAtAction`).
- No business logic, no EF Core, no Domain entities in controllers. Work with DTOs only.
- Protect endpoints with `[Authorize]`; keep JWT wiring in `Program.cs` (`AddJwtAuthentication`, `UseAuthentication`/`UseAuthorization`) in the existing order.
- Service registration goes in `Extensions/ServiceCollectionExtensions.cs`; `Program.cs` composes the `Add*` methods from each layer.
- Never log PII, tokens, or secrets.
- Mirror `ProductsController` / `AuthController`.
