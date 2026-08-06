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