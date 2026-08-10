## Feature

Centralized Configuration

### What

Created a centralized configuration module (`config.js`) to manage all environment variables.

### Why

Avoid direct use of `process.env` across the application and establish a single source of truth for configuration.

### How

- Created `src/config/config.js`
- Loaded `.env` using `dotenv`
- Grouped configuration into:
  - server
  - database
  - jwt
- Updated `index.js` and `mongodb.js` to use the configuration module.

### Status

✅ Completed


## Feature

API Response Standardization

### What

Introduced a reusable `ApiResponse` class to standardize all successful API responses.

### Why

To ensure every endpoint returns a consistent response structure, making frontend integration simpler and improving maintainability.

### How

- Created `src/utils/ApiResponse.js`
- Updated the health endpoint to use the new response wrapper.

### Status

✅ Completed


## Feature

API Error Handling

### What

Introduced a reusable `ApiError` class and centralized error middleware.

### Why

To standardize error responses and remove duplicate error-handling logic from controllers.

### How

- Created `ApiError`
- Added `error.middleware.js`
- Added `notFound.middleware.js`
- Registered both in `app.js`

### Status

✅ Completed

Date - 10/08/2026

## Feature

API Routing Architecture & Versioning

### What

Moved API routes into a dedicated routing layer and introduced `/api/v1`.

### Why

To keep `app.js` focused on application configuration and make the API scalable as new modules are added.

### How

- Created `routes/index.js`
- Created `routes/health.routes.js`
- Moved the health endpoint into its own route module
- Mounted the router under `/api/v1`
- Kept 404 and global error middleware after all routes

### Result

Health endpoint:

GET /api/v1/health

### Status

✅ Completed


## Feature

Async Handler

### What

Created a reusable asyncHandler utility for asynchronous controllers.

### Why

To avoid repetitive try/catch blocks in every asynchronous controller and forward errors to the centralized error middleware.

### How

Created `src/utils/asyncHandler.js`.

The utility wraps an asynchronous function and forwards rejected promises to Express's `next()` middleware.

### Testing

Tested:
- ApiError
- Unexpected JavaScript Error

Both were correctly handled by the global error middleware.

### Status

✅ Completed

## Feature

Request ID Middleware

### What

Added a unique request identifier to every incoming HTTP request.

### Why

Request IDs allow us to trace individual requests through application logs and simplify debugging in production.

### How

- Used Node.js `crypto.randomUUID()`.
- Stored the ID on `req.requestId`.
- Returned the ID using the `X-Request-ID` response header.
- Accepted an existing `X-Request-ID` from clients for request propagation.

### Testing

Verified:
- Every request receives a unique request ID.
- Request ID is returned in the response headers.
- Existing request IDs can be propagated.

### Status

✅ Completed

## Feature

HTTP Request Logging

### What

Replaced Morgan with a centralized Winston-based HTTP request logger.

### Why

To capture structured request information and prepare the application for production observability and AWS CloudWatch integration.

### How

- Removed Morgan.
- Updated Winston to output structured JSON logs.
- Created `requestLogger.middleware.js`.
- Captured:
  - Request ID
  - HTTP method
  - URL
  - Status code
  - Response time
  - IP address
  - User-Agent
- Used the response `finish` event to calculate actual request duration.

### Status

✅ Completed

## Feature

Graceful Shutdown

### What

Implemented graceful shutdown handling for the HTTP server and MongoDB connection.

### Why

The application must safely release resources when the process receives termination signals from Docker, AWS, CI/CD systems, or the operating system.

### How

- Added `disconnectDB()` to close the MongoDB connection.
- Updated `connectDB()` to throw startup errors instead of terminating the process directly.
- Added SIGINT handling.
- Added SIGTERM handling.
- HTTP server stops accepting new connections.
- Existing requests are allowed to complete.
- MongoDB connection is closed.
- Application exits after cleanup.

### Testing

Verified graceful shutdown using Ctrl+C / SIGINT during local development.

### Status

✅ Completed