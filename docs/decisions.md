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


### Add this to `decisions.md`

```md
## Architecture Decisions — Authentication & User Management

### 1. JWT-based authentication

Decision:

Use JWT for API authentication.

Reason:

- Stateless authentication
- Suitable for REST APIs
- Easy integration with protected routes
- User identity can be extracted from the token

---

### 2. Authentication middleware

Decision:

JWT verification is handled through middleware rather than individual controllers.

Reason:

Keeps authentication logic centralized and reusable.

---

### 3. Role-based authorization

Decision:

Authorization is handled separately from authentication.

Reason:

A valid JWT only proves the user's identity. Route access must additionally depend on the user's role.

---

### 4. Controller-Service separation

Decision:

Business logic belongs in services rather than controllers.

Reason:

- Controllers remain thin
- Business logic becomes reusable
- Easier testing
- Cleaner architecture

---

### 5. Password hashing through Mongoose middleware

Decision:

Hash passwords automatically through the User model's `pre("save")` hook.

Reason:

Prevents password hashing logic from being duplicated across services.

---

### 6. Password field excluded by default

Decision:

Keep the User password field configured with:

```js
select: false