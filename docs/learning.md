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