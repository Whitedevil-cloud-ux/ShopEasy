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

## ADR-003

### Decision

Use Winston as the centralized logging library for application and HTTP request logs.

### Alternatives Considered

- console.log
- Morgan + Winston
- Winston only

### Decision

Winston only.

### Rationale

Using one logging system provides:

- Consistent log format
- Centralized configuration
- Structured JSON logging
- Easier CloudWatch integration
- Fewer dependencies

### Status

Accepted