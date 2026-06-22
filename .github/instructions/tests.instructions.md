---
applyTo: "**/tests/**"
---

# Tests

- **xUnit**, one project per layer under `tests/unit-tests/*.Tests`, mirroring the source layout. Follow the existing `Product*Tests` style.
- Coverage per aggregate: Domain invariants (no mocks); Application returns `Result.Ok`/`Result.Fail` and invokes `SaveChangesAsync`/`IMapper` (mock repo/UoW/mapper/domain service); Infrastructure CRUD on EF Core InMemory; API controller maps `Result` → `IActionResult`; Transversal mapping round-trips.
- Mock only at layer boundaries; never mock the type under test.
- Arrange-Act-Assert, one behavior per test, names `Method_Condition_Expected`.
- No new test framework or fixtures beyond what the test projects already use. Run `dotnet test` and fix failures.
