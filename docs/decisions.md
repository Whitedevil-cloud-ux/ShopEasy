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

## ADR-005

### Decision

Implement graceful shutdown handling for the HTTP server and MongoDB connection.

### Why

ShopEasy will eventually run in Docker and AWS infrastructure where processes can receive SIGTERM during deployments and container replacement.

### Consequences

The application now:

- Handles SIGINT and SIGTERM.
- Stops accepting new HTTP requests.
- Allows active requests to finish.
- Closes MongoDB connections.
- Exits cleanly.

### Status

Accepted

## 2026-08-12 — Authentication Architecture Decisions

### JWT Payload
Decision:
JWT payload will contain the user's MongoDB `_id` and `role`.

```js
{
    userId,
    role
}