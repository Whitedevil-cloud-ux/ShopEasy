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