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

Date: 22/08/2026

## Product & Category Schema Decisions

### Product

The Product model will contain:

* `name` — required string
* `description` — required string
* `price` — required non-negative integer
* `category` — reference to the Category model using ObjectId
* `variants` — array of embedded Variant subdocuments

### Variant

Each Product variant will contain:

* `sku` — required string
* `color` — required string
* `size` — optional string
* `quantity` — required non-negative integer

### Why variants are embedded

Variants are directly associated with their Product and contain inventory-specific information such as SKU and quantity.

Therefore, variants are represented as embedded subdocuments:

```js
variants: [variantSchema]
```

### Why Category is a separate model

Category is an independent entity that can be shared by many Products.

Products therefore reference Category using:

```js
category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
}
```

### Category

The Category model will contain:

* `name` — required
* `description` — optional
* `slug` — required and unique

### Slug generation

The client/seller will not be responsible for generating the slug.

The backend will generate the slug from the category name during category creation.

Example:

```text
Men's Clothing → mens-clothing
```

Category creation/business logic belongs in the Service layer.

### Price design

Product price will be stored as an integer representing the base product price.

Taxes, delivery fees, discounts and other transaction-specific amounts will be calculated later at the cart/order level rather than stored in the Product model.

### SKU design

SKU belongs to the Variant rather than the Product because each variant represents a distinct inventory item.

SKU uniqueness will be handled as part of the product/inventory implementation rather than blindly treating `unique: true` as ordinary validation.

### Current relationship design

```text
Category
   ↑
   │ ObjectId reference
   │
Product
   │
   └── variants[]
          ├── sku
          ├── color
          ├── size
          └── quantity
```
## 2026-08-25 — Product Creation API Decisions

### Decision 1 — Product creation is admin-only

```Product creation currently requires:

- text
JWT authentication
        ↓
Admin role authorization
```

## 2026-08-27

---

This one is important because we've made several actual architectural decisions today.

Add:

```md
## Product Management Decisions

### Product Authorization

Product creation, update, and deletion are restricted to users with the `admin` role.

Current policy:

- User → cannot manage product data
- Admin → can create, update, and delete products

The authorization middleware is kept separate from authentication.

### Product Update Uses PATCH

Product updates use:

`PATCH /api/v1/products/:id`

rather than requiring the complete product object.

Reason:

An administrator may want to change only one field, such as price, without resending the complete product.

### Partial Update Strategy

Only fields explicitly supplied by the administrator are included in the update operation.

`undefined` fields are ignored.

This prevents unspecified fields from being overwritten.

### Empty PATCH Requests

A PATCH request containing no updateable fields returns:

- HTTP 400
- `NO_FIELD_UPDATED`

Reason:

An update request should contain at least one actual change.

### Product ID Validation

Product IDs are explicitly checked with Mongoose ObjectId validation before database operations.

Invalid format:

- HTTP 400
- `INVALID_FORMAT`

A correctly formatted ID that does not correspond to an existing product returns:

- HTTP 404
- `PRODUCT_NOT_FOUND`

### Category Integrity

When a category is supplied during product creation or update:

1. The category ID format is validated.
2. The category document is checked for existence.

This prevents products from referencing a category that does not exist.

### Product Deletion

Product deletion returns the deleted product document after successful deletion.

A missing product returns 404 rather than silently succeeding.

### Product API Testing

Product CRUD endpoints were tested through Postman for both successful and failure scenarios before considering the feature complete.

## 2026-09-10

ShopEasy supports two product types: simple and variable. Simple products own price and stock at the Product level, while variable products delegate price and stock to their separate Variant documents. Product-level price/stock are rejected for variable products rather than silently ignored.

## 2026-09-11

## Variant Architecture Decisions

### Variant as a Separate Collection

Decision:
Store Variants in a separate MongoDB collection.

Reason:
A Variant represents an individual purchasable configuration and has its own SKU, price and stock.

Variant references Product through:

product: ObjectId

---

### Variant Belongs Only to Variable Products

Decision:
A Variant may only be created for a Product whose type is `variable`.

Reason:
Simple Products have their own Product-level price and stock and do not require purchasable configurations.

Attempting to create a Variant for a simple Product returns:

400 Bad Request

---

### SKU Is Globally Unique

Decision:
SKU must be unique across ShopEasy.

Reason:
SKU is an inventory/business identifier rather than merely a Product-specific identifier.

MongoDB enforces the uniqueness constraint.

Duplicate SKU:

409 Conflict

---

### Variant Combination Must Be Unique Per Product

Decision:
Two Variants belonging to the same Product cannot have the same attribute combination.

Reason:
Two Variants representing the same purchasable configuration would be redundant even if their SKUs are different.

Example:

Variant A:
Color = Blue
Size = M

Variant B:
Size = M
Color = Blue

These represent the same combination.

---

### Attribute Order Is Not Significant

Decision:
Attribute order does not determine Variant identity.

Reason:
`Color + Size` and `Size + Color` describe the same configuration.

Implementation:
- normalize attributes
- sort by attribute name
- generate deterministic variation key

---

### Case and Whitespace Are Not Significant for Comparison

Decision:
Attribute names and string values are normalized using trimming and lowercase conversion before comparison.

Reason:
Values such as:

" Blue "
"BLUE"
"blue"

should not create separate Variant combinations.

---

### Variation Key Is Generated Rather Than Stored

Decision:
Generate the variation key in the service when checking for duplicate combinations rather than storing it as a required Variant field.

Reason:
The key is currently an implementation detail used for comparison rather than part of the external Variant data model.

The key is generated using:

JSON.stringify(normalizedAndSortedAttributes)

---

### Duplicate Variation Uses 409 Conflict

Decision:
A duplicate attribute combination returns:

409 Conflict

with:

DUPLICATE_VARIATION

Reason:
The request is valid in structure but conflicts with an existing Variant combination.

---

### Variable Product Must Eventually Have at Least One Variant

Decision:
A variable Product must not ultimately exist without at least one Variant.

Current status:
Not yet implemented.

Reason:
Product and Variant are separate MongoDB documents. Enforcing this invariant requires careful handling of the Product + Variant creation lifecycle and potentially a transaction.

This decision will be implemented in the next stage rather than using an incomplete workaround.