# Auth / JWT reminder (auto-injected)

This codebase uses ASP.NET Core Identity + JWT bearer (HS256):

- Token issuing is behind `IJwtTokenService` (`*.Infrastructure.Data.Contracts/Auth`), implemented in Infrastructure with `JwtSettings`. Don't issue or validate tokens outside this service.
- The signing key must be ≥32 chars for HS256 and comes from configuration (`JwtSettings`), never hard-coded. The `dotnet new` template generates one; in real deployments load it from a secret store, not appsettings committed to git.
- Identity user is `ApplicationUser` (`*.Domain.Entities/Identity`). Auth endpoints live in `AuthController`; register/login DTOs in `*.Application.DTO/Auth`.
- Protect endpoints with `[Authorize]`; wire auth in `Program.cs` via `AddJwtAuthentication` + `UseAuthentication`/`UseAuthorization` (already present — keep the order).
- Never log tokens, passwords, or the signing key. Return auth failures as `Result.Fail` / appropriate status codes, not exceptions leaking detail.
