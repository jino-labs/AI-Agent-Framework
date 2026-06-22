# GDPR / data-protection checklist (auto-injected)

This request touches personal data. Apply data-protection by design — these are hard
requirements, not suggestions:

- **Lawful basis & minimization:** store only PII the use-case needs. Don't add "might be useful" personal fields. Document the basis (consent, contract, legitimate interest) for each.
- **PII stays out of logs:** never log names, emails, tokens, IDs that identify a person, or full request bodies containing them. Mask/redact.
- **Erasure & rectification:** the aggregate must support delete/anonymize (right to erasure) and update (rectification). Soft-delete that retains PII is not erasure.
- **Access control:** PII endpoints require authorization; don't expose PII in DTOs returned to clients that shouldn't see it. Separate internal vs. public DTOs.
- **Data at rest/in transit:** sensitive fields encrypted or hashed where appropriate (e.g. never store plaintext secrets); HTTPS enforced (the template already calls `UseHttpsRedirection`).
- **Retention:** don't keep PII indefinitely — note a retention/expiry path if the entity is long-lived.
- **Auditability:** record who accessed/changed PII where the domain requires it, without logging the PII values themselves.

Keep PII concerns in the right layer: validation/invariants in the domain service,
authorization in the API, never PII-specific logic leaking into mapping or persistence
without reason.
