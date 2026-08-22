# API Response Standardization

## What?

A reusable wrapper that ensures every successful API returns the same JSON structure.

## Why?

- Consistent API design
- Easier frontend development
- Better documentation
- Simpler testing

## Standard Format

{
  success,
  statusCode,
  message,
  data
}

# ApiError

## What?

A custom error class extending JavaScript's built-in `Error`.

## Why?

- Standardized errors
- Easier debugging
- Cleaner controllers
- Centralized error handling

## Benefits

- Every API returns the same error format.
- Logging happens in one place.
- Business logic stays focused on business rules.

## What is morgan? 
- It is an HTTP request logger middleware specifically built for Node.js.
- Its only job: To automatically intercept incoming HTTP requests to your express server and log details about them (e.g., the HTTP method, the URL route, the status code, and how long the response took).
- Example output: GET /api/v1/health 200 4.192 ms - 74

## What is winston?
- It is a highly versatile, general-purpose loggin library for Node.js.
- Its job: to log anything happening in your application - not just HTTP requests. This includes database connection errors, background job statuses, business logic events, and debugging information.
- Key feature: It supports transports, meaning you can tell Winston to save "Error" logs to a file, send "Critical" logs to a monitoring service (like Datadog or AWS CloudWatch), and print "info" logs to your local console. 

# API Versioning

## What?

API versioning allows different versions of an API to coexist.

## Why?

It prevents breaking existing clients when introducing incompatible API changes.

## Example

/api/v1/products

/api/v2/products

## Key Takeaway

API versioning is particularly useful when APIs have external consumers or need backward compatibility.

# Async Handler

## What?

A higher-order function that wraps asynchronous Express handlers and forwards rejected promises to the error middleware.

## Why?

Without it, controllers often contain repetitive try/catch blocks.

## Flow

Request
→ Controller
→ Promise rejection
→ next(error)
→ Global Error Middleware
→ Response

## Key Takeaway

Keep business logic separate from repetitive error-handling boilerplate.

# Request ID

## What?

A unique identifier associated with an HTTP request.

## Why?

It allows developers to trace a request through logs and distributed services.

## Example

Request:

GET /api/v1/orders

Request ID:

8f72a1c4-...

## Production Use

Request IDs become especially useful with:

- Microservices
- Load balancers
- Reverse proxies
- CloudWatch
- Distributed tracing

## Key Takeaway

A request ID connects application events belonging to the same request.

# HTTP Request Logging

## What?

HTTP request logging records information about incoming HTTP requests and their resulting responses.

## Why?

It helps with:

- Debugging
- Performance analysis
- Security investigations
- Production monitoring
- Request tracing

## Information Captured

- Request ID
- HTTP method
- URL
- Status code
- Response time
- IP address
- User-Agent

## Why Structured Logs?

JSON logs can be easily parsed, searched, filtered, and processed by systems such as AWS CloudWatch.

## Key Takeaway

Application logs should be structured and useful for diagnosing real production problems.

# Graceful Shutdown

## What?

Graceful shutdown is the controlled termination of an application where active resources are cleaned up before the process exits.

## Why?

Applications running in production environments may receive termination signals during:

- Docker container replacement
- EC2 deployments
- CI/CD deployments
- Server restarts
- Application updates

## Important Signals

### SIGINT

Commonly generated when a process is interrupted manually, such as Ctrl+C.

### SIGTERM

A standard termination signal commonly used by process managers, containers, and orchestration systems.

## Shutdown Flow

SIGTERM / SIGINT
→ Stop accepting new requests
→ Finish active requests
→ Close MongoDB
→ Exit

## Key Takeaway

Production applications should cleanly release resources before terminating.

## 2026-08-12 — Authentication & JWT

### Learned
- JWT authentication flow from login to protected routes.
- `jwt.sign()` creates a JWT using a payload and `JWT_SECRET`.
- JWT payload currently contains:
  - `userId`
  - `role`
- `jwt.verify()` validates the token signature and expiration and returns the decoded payload.
- `Authorization` header uses the format:
  `Bearer <token>`
- `req.headers.authorization` is used to access the Authorization header.
- `access.split(" ")[1]` extracts the JWT from the Bearer token.
- `req.user = decoded` makes authenticated user information available to downstream controllers.
- Mongoose `select: false` can hide sensitive fields such as passwords by default.
- `.select("+password")` explicitly includes the password only when authentication requires it.
- Authentication business logic belongs in the service layer, while controllers handle HTTP requests/responses.
- Authentication middleware should protect routes that require an already-authenticated user; login itself should not use JWT middleware.
- `express-validator` validates request data before it reaches the controller.

### Debugging Learned
- A registration request failed because `confirmPassword` was required by the validator but missing from the Postman request.
- Login initially failed because `password` was configured with `select: false` in the User model.
- Fixed the login query using:
  `User.findOne({ email }).select("+password")`
- Verified registration, login, JWT creation, JWT verification, and a protected `/me` endpoint through Postman.

### Important Mental Model
Register:
Request → Validation → Controller → Service → Database

Login:
Request → Validation → Controller → Service → Password Verification → JWT Creation → Response

Protected Request:
Request + Bearer JWT → Auth Middleware → JWT Verification → `req.user` → Controller

## Authentication & User Management — Lessons Learned

### JWT Authentication

Learned how JWT authentication works across the request lifecycle:

1. User logs in
2. Server verifies credentials
3. Server generates JWT
4. Client sends JWT using `Authorization: Bearer <token>`
5. Authentication middleware verifies the token
6. User information is attached to `req.user`
7. Protected controllers/services use the authenticated user ID

### Role-Based Authorization

Learned that authentication and authorization are different:

- Authentication → "Who are you?"
- Authorization → "Are you allowed to do this?"

Implemented role-based access using the authenticated user's role.

### Express Validator

Learned how to create reusable validation rules.

Important concepts:

- `body()`
- `.notEmpty()`
- `.isLength()`
- `.matches()`
- `.custom()`
- `validationResult()`

### Custom Validation

`custom()` is useful when validation depends on another field.

Example:

```js
.custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.newPassword) {
        throw new Error("Passwords do not match");
    }

    return true;
})

Date: 22/08/2026

## Product & Category Schema Session

### 1. Embedded Subdocuments

Learned how to use a separate Mongoose schema as an embedded subdocument.

```js
variants: [variantSchema]
```

This means a Product can contain multiple variants, and every variant follows the rules defined by `variantSchema`.

Example structure:

```text
Product
└── variants[]
      ├── sku
      ├── color
      ├── size
      └── quantity
```

### 2. Custom Mongoose Validation

Learned the difference between `validate`, `validator`, and `message`.

```js
validate: {
    validator: Number.isInteger,
    message: "Product price must be an integer",
}
```

* `validate` defines a custom validation rule.
* `validator` is the function that performs the actual check.
* `message` is returned when the validation fails.

Also learned that a function can be passed to Mongoose without calling it immediately:

```js
Number.isInteger
```

rather than:

```js
Number.isInteger()
```

### 3. Integer Validation

Product price and variant quantity must contain whole numbers.

Examples:

```text
999    → valid
0      → valid
999.5  → invalid
```

`Number.isInteger()` was used for this validation.

### 4. `unique` vs Validation

Learned that:

```js
unique: true
```

is not a normal Mongoose validation rule.

It is related to creating a unique database index.

This is different from rules such as:

```text
required
min
max
minLength
maxLength
validate
```

### 5. Embedded Documents vs References

Learned the difference between embedding and referencing.

Variants are embedded:

```js
variants: [variantSchema]
```

because variants belong directly to a Product.

Categories are referenced:

```js
category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
}
```

because a Category is an independent document that can be associated with many Products.

### 6. Category References

The Product now stores the Category's MongoDB ObjectId instead of storing the category name directly.

Conceptually:

```text
Product.category
      ↓
Category._id
```

This creates a one-to-many relationship:

```text
Category
 ├── Product
 ├── Product
 └── Product
```

### 7. SKU

Learned that SKU means **Stock Keeping Unit**.

A SKU identifies a specific inventory variant rather than just the general product.

Example:

```text
Classic T-Shirt
├── TSH-RED-M
├── TSH-RED-L
└── TSH-BLU-M
```

SKU uniqueness will be handled properly when the inventory/product creation logic is implemented.

### 8. Backend Slug Generation

Learned that a category slug should be generated by the backend rather than requiring the seller/client to provide it.

Example:

```text
Men's Clothing
        ↓
mens-clothing
```

The Category Service will be responsible for the category creation workflow, while the actual slug transformation may eventually be extracted into a reusable utility.

### 9. Schema Validation Testing

Created a temporary Product validation test without saving the document to MongoDB.

Tested:

```text
price: 999.5
→ validation failed
```

Then:

```text
price: 999
→ validation passed
```

This confirmed that the custom integer validation is working correctly.
