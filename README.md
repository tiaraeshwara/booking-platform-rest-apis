# Booking Platform REST API

Booking Platform REST API built with NestJS, TypeScript, TypeORM, and PostgreSQL.

## Project Overview

This API supports:
- User authentication (register, login, refresh token)
- Service management (authenticated CRUD)
- Booking management (public creation, authenticated management)
- Booking business rules (no past slots, no invalid status transitions, duplicate slot prevention)

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Passport + JWT
- class-validator / class-transformer
- Swagger (OpenAPI)
- Jest + Supertest

## Installation Steps

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and set values:

| Variable | Description |
| --- | --- |
| PORT | Application port |
| DATABASE_HOST | PostgreSQL host |
| DATABASE_PORT | PostgreSQL port |
| DATABASE_USER | PostgreSQL user |
| DATABASE_PASSWORD | PostgreSQL password |
| DATABASE_NAME | PostgreSQL database name |
| JWT_SECRET | Access token secret |
| JWT_EXPIRES_IN | Access token lifetime |
| JWT_REFRESH_SECRET | Refresh token secret |
| JWT_REFRESH_EXPIRES_IN | Refresh token lifetime |

## Database Setup

### Local PostgreSQL
1. Create a database (example: `booking_platform`).
2. Set `.env` values to your local instance.
3. Run migrations.

### Docker (optional)

```bash
docker run --name booking-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=booking_platform -p 5432:5432 -d postgres:16
```

## Running the Application

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

## Running Migrations

```bash
# create migration file from entity changes
npm run migration:generate

# run pending migrations
npm run migration:run

# rollback last migration
npm run migration:revert
```

## API Documentation

- Swagger UI: `http://localhost:3000/api/docs`
- Postman collection: `postman/Booking-Platform-API.postman_collection.json`
- Postman environment: `postman/Booking-Platform-API.postman_environment.json`

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Assumptions Made

- Only booking creation (`POST /bookings`) is public.
- Booking cancellation endpoint requires authentication to align with admin-style management.
- Services cannot be deleted while pending bookings exist.
- Duplicate slot prevention is enforced in service logic against non-cancelled bookings.
- Datetime comparisons use server timezone.
- Customer phone validation follows E.164-style regex.

## Future Improvements

- Role-based access control (admin/provider/customer)
- Rate limiting and brute-force protection on auth endpoints
- Email/SMS notifications for booking lifecycle events
- Redis caching for list endpoints
- Dedicated integration tests with isolated test DB
