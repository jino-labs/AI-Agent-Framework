---
applyTo: "**/*.Application.Contracts/**,**/*.Application.DTO/**,**/*.Application.Service/**"
---

# Application layer

- Service interfaces in `*.Application.Contracts`, implementations in `*.Application.Service`, DTOs in `*.Application.DTO`.
- Application services **return `Result` / `Result<T>`** (`Application.DTO/Common/Result.cs`) — never throw for not-found or validation failures.
- Flow: load via repository → run domain-service validation → persist via repository → commit with `IUnitOfWork.SaveChangesAsync(ct)` → map with `MapsterMapper.IMapper`.
- Inject only interfaces (repository, domain service, `IUnitOfWork`, `IMapper`); constructor injection.
- Every async method takes `CancellationToken ct = default` and forwards it.
- DTOs per aggregate: `<Name>Dto`, `Create<Name>Dto`, `Update<Name>Dto`. Map in Transversal, not inline.
- Register in `*.Application.Service/DependencyInjection.cs` (`AddApplicationServices`).
