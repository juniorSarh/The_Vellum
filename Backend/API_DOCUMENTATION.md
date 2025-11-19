# Customer Authentication API Documentation

This API provides customer authentication and profile management functionality.

## Base URL

```
http://localhost:3000/api/customers
```

## Authentication Endpoints

### Register Customer

- **Endpoint:** `POST /api/customers/register`
- **Description:** Register a new customer account
- **Request Body:**

```json
{
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "Password123!",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

- **Response (201):**

```json
{
  "customer": {
    "id": 1,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Responses:**
  - `400 Bad Request`: Validation errors
  - `409 Conflict`: Email already exists

### Login Customer

- **Endpoint:** `POST /api/customers/login`
- **Description:** Authenticate a customer
- **Request Body:**

```json
{
  "email": "customer@example.com",
  "password": "Password123!"
}
```

- **Response (200):**

```json
{
  "customer": {
    "id": 1,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Responses:**
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`: Invalid email or password

## Profile Management (Protected Endpoints)

These endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get Customer Profile

- **Endpoint:** `GET /api/customers/profile`
- **Description:** Get the authenticated customer's profile
- **Response (200):**

```json
{
  "id": 1,
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Update Customer Profile

- **Endpoint:** `PATCH /api/customers/profile`
- **Description:** Update the authenticated customer's profile
- **Request Body:**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+0987654321",
  "address": "456 Oak Ave, New City, State"
}
```

- **Response (200):**

```json
{
  "id": 1,
  "email": "customer@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+0987654321",
  "address": "456 Oak Ave, New City, State",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T02:00:00.000Z"
}
```

## Admin Operations (Protected Endpoints)

These endpoints require authentication and are intended for admin use.

### Get All Customers

- **Endpoint:** `GET /api/customers`
- **Description:** Get all customers (admin only)
- **Response (200):**

```json
[
  {
    "id": 1,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Customer by ID

- **Endpoint:** `GET /api/customers/:id`
- **Description:** Get a specific customer by ID (admin only)
- **Response (200):** Same as Get Customer Profile

### Update Customer

- **Endpoint:** `PATCH /api/customers/:id`
- **Description:** Update a customer by ID (admin only)
- **Request Body:** Same as Update Customer Profile
- **Response (200):** Same as Update Customer Profile

### Delete Customer

- **Endpoint:** `DELETE /api/customers/:id`
- **Description:** Delete a customer by ID (admin only)
- **Response (204):** No content

### Deactivate Customer

- **Endpoint:** `PATCH /api/customers/:id/deactivate`
- **Description:** Deactivate a customer account (admin only)
- **Response (200):**

```json
{
  "id": 1,
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "is_active": false,
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T03:00:00.000Z"
}
```

## Validation Rules

### Password Requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Email Format:

- Must be a valid email address (e.g., user@example.com)

### Name Requirements:

- First and last names must be at least 2 characters long

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": ["Detailed validation errors (if applicable)"]
}
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT signing

## Example Usage

### Register a new customer:

```bash
curl -X POST http://localhost:3000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "Password123!"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Get profile (with token):

```bash
curl -X GET http://localhost:3000/api/customers/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
