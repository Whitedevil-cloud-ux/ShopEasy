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

Date: 11/08/2026

## Feature

Authentication - User Model Testing

### What

Tested the User model against MongoDB Atlas.

### Why

To verify that the model, password hashing, password comparison, validation, and database persistence work correctly before building the authentication API.

### How

- Created a temporary test user.
- Verified MongoDB persistence.
- Verified bcrypt password hashing.
- Verified correct password comparison.
- Verified incorrect password rejection.
- Removed temporary test data after verification.

### Issues Resolved

- Fixed Mongoose async `pre("save")` middleware usage.
- Fixed MongoDB write concern typo from `majority` to `majority`.

### Status

✅ Completed

### Final Test Result

- New user registration: ✅ 201 Created
- User persisted in MongoDB Atlas: ✅
- Duplicate email: ✅ 409 Conflict
- Password hashing: ✅
- Password excluded from response: ✅
- Public admin role injection prevented: ✅
- MongoDB write concern configuration: ✅

### Status

✅ Completed

## 2026-08-12 — ShopEasy Authentication Progress

### Completed
- [x] User registration service
- [x] User login service
- [x] Password comparison using bcrypt
- [x] JWT token generation
- [x] JWT payload with `userId` and `role`
- [x] JWT authentication middleware
- [x] Authorization header parsing
- [x] JWT verification
- [x] `req.user` population
- [x] Login controller
- [x] Login validation
- [x] Authentication routes
- [x] Protected `/me` endpoint
- [x] Tested registration using Postman
- [x] Tested login using Postman
- [x] Tested protected endpoint using Bearer JWT
- [x] Debugged Mongoose `select: false` password issue

### Authentication Flow Status

Registration: ✅ Working

Login: ✅ Working

JWT Generation: ✅ Working

JWT Verification: ✅ Working

Protected Routes: ✅ Working

Role included in JWT: ✅ Working

### Current Authentication Architecture

routes
↓
validation middleware
↓
controller
↓
service
↓
model / database

Protected routes additionally use:

authMiddleware
↓
jwt.verify()
↓
req.user

### Next Session
- Implement authorization/role checks on top of authentication.
- Continue building authenticated user-side features.
- Use `req.user.userId` to identify the currently authenticated user.
- Begin user-specific resources such as profile, cart, orders, etc.

## 2026-08-21 — Authentication & User Management Progress

### Completed

- [x] JWT authentication implemented
- [x] JWT token generated during login
- [x] JWT authentication middleware implemented
- [x] Protected `/auth/me` route tested successfully
- [x] Role-based authorization middleware implemented
- [x] Admin/user role access tested successfully
- [x] User profile retrieval implemented
- [x] User profile update implemented
- [x] Nested address update implemented
- [x] Password change functionality implemented
- [x] Current password verification implemented
- [x] New password validation implemented
- [x] Confirm password validation implemented
- [x] Password hashing through Mongoose `pre("save")` middleware
- [x] Old password rejected after password change
- [x] New password verified successfully after password change
- [x] All implemented features tested through Postman
- [x] Changes committed and pushed to GitHub

### Current Backend Status

Authentication and user-management foundation is functional.

Current flow:

Request
→ Route
→ Authentication/Authorization
→ Validation
→ Controller
→ Service
→ Model/Database
→ Response

### Latest Completed Feature

**Change Password**

Endpoint:

`PUT /api/v1/users/change-password`

Verified:
- Correct current password → update succeeds
- Incorrect current password → rejected
- Invalid new password → validation fails
- Mismatched confirmation password → validation fails
- Old password after update → login rejected
- New password after update → login succeeds

Date: 22/08/2026

## Current Status

### Completed

* [x] Product schema created
* [x] Product name validation
* [x] Product description validation
* [x] Product price validation
* [x] Integer validation for product price
* [x] Variant schema created
* [x] Variant SKU field
* [x] Variant color field
* [x] Optional variant size
* [x] Variant quantity validation
* [x] Integer validation for variant quantity
* [x] Embedded variants in Product
* [x] Category schema created
* [x] Category name
* [x] Optional category description
* [x] Category slug
* [x] Category → Product reference design
* [x] Product → Category ObjectId reference
* [x] Product schema validation manually tested
* [x] Decimal product price rejected
* [x] Integer product price accepted
* [x] Changes committed and pushed to GitHub
* [x] Working tree confirmed clean

## Current Product Structure

```text
Product
├── name
├── description
├── price
├── category → Category ObjectId
└── variants[]
      ├── sku
      ├── color
      ├── size
      └── quantity
```

## Next Development Stage

### Product Management API

Next session will begin the Product creation flow.

Planned sequence:

```text
Product creation design
        ↓
Request validation
        ↓
Product Service
        ↓
Category existence validation
        ↓
SKU/business-rule handling
        ↓
Create Product
        ↓
Product Controller
        ↓
Product Route
        ↓
JWT authentication
        ↓
Admin authorization
        ↓
API testing
```

## Tomorrow's Goal

Build the architecture and implementation for:

**Create Product**

Target endpoint:

```text
POST /api/v1/products
```

Before implementation, understand the responsibility of:

* Route
* Authentication middleware
* Authorization middleware
* Request validation
* Controller
* Service
* Product model
* Category reference

## 2026-08-25 — Product Creation API

### What we worked on
- Built the Product creation API.
- Added Product service layer, controller, and routes.
- Connected Product routes to the main Express application.
- Added admin-only authorization for product creation.
- Connected product request validation with the existing validation middleware.
- Added Category existence verification in the Product service.
- Tested the complete Product creation flow with Postman.

### Testing completed
- Valid admin request → 201 Created ✅
- Invalid product fields → 400 Bad Request ✅
- Normal user attempting product creation → 403 Forbidden ✅
- Valid MongoDB ObjectId but nonexistent category → 404 Not Found ✅
- Missing authentication token → 401 Unauthorized ✅

### Result
Product creation is working end-to-end through authentication, authorization, validation, controller, service, category verification, and MongoDB persistence.

## 2026-08-27 ## Product Management — CRUD — COMPLETED + TESTED

### Get All Products
`GET /api/v1/products`

- JWT authentication required
- Returns all products
- Category is populated
- Empty database returns an empty array
- Tested successfully

### Get Product by ID
`GET /api/v1/products/:id`

- JWT authentication required
- MongoDB ObjectId format validated
- Invalid ID format returns 400
- Non-existent product returns 404
- Category is populated
- Tested successfully

### Update Product
`PATCH /api/v1/products/:id`

- Admin-only access
- JWT authentication
- Partial updates supported
- Only supplied fields are updated
- Update fields are validated
- Category existence is checked when supplied
- Invalid product ID returns 400
- Non-existent product returns 404
- Empty update request returns 400
- Returns the updated product
- Tested successfully

### Delete Product
`DELETE /api/v1/products/:id`

- Admin-only access
- JWT authentication
- MongoDB ObjectId format validated
- Non-existent product returns 404
- Product successfully deleted
- Returns the deleted product
- Tested successfully

### Authorization Testing

Product management endpoints were tested for:

- No authentication token → 401
- Authenticated non-admin user → 403
- Invalid product ID → 400
- Non-existent product → 404
- Successful operations → 200/201