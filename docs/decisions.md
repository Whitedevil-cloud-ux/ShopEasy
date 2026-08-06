## ADR-002

### Decision

Use a centralized configuration module instead of accessing `process.env` directly.

### Rationale

- Cleaner code
- Easier testing
- Better maintainability
- Single source of truth
- Simplifies environment management

### Status

Accepted