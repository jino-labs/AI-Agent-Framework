# Testing reminder (auto-injected)

Tests are **xUnit**, one project per layer under `tests/unit-tests/*.Tests`, mirroring the
source folder layout. Follow the existing `Product*Tests` style.

- **Domain:** invariant methods throw on bad input / pass on valid; rule methods (`CanBeDeleted`) covered. No mocks — domain is pure.
- **Application:** service returns `Result.Ok` on success and `Result.Fail` on not-found/invalid; verify `IUnitOfWork.SaveChangesAsync` and `IMapper` are invoked. Mock repo/UoW/mapper/domain-service.
- **Infrastructure:** repository CRUD against EF Core InMemory (or the project's existing test-DB approach).
- **API:** controller maps `Result` → the correct `IActionResult`.
- **Transversal:** mapping round-trips entity↔DTO.

Mock only at layer boundaries; never mock the type under test. Arrange-Act-Assert, one
behavior per test, names like `Method_Condition_Expected`. Run `dotnet test` and fix
failures before finishing. Don't introduce a new test framework or fixtures.
