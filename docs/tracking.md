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