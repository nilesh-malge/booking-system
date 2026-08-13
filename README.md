# Booking Management System

Backend API for managing users, services, and bookings.

## Tech Stack

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Prisma
- JWT
- Docker

## Features

- User registration and login
- JWT authentication
- Role-based access control
- Admin, Manager and Staff roles
- Service management
- Booking management
- Booking status management
- PostgreSQL database
- Docker Compose setup

## Project Structure

```text
src/
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── bookings/
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   └── bookings.module.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/
└── main.ts

prisma/
└── schema.prisma
```

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Run database migrations:

```bash
npx prisma migrate dev
```

## Run the Application

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

The API runs on:

```text
http://localhost:3000
```

## Authentication

### Register

```http
POST /auth/register
```

Example:

```json
{
  "name": "Staff User",
  "email": "staff@test.com",
  "password": "password123"
}
```

### Login

```http
POST /auth/login
```

Example:

```json
{
  "email": "staff@test.com",
  "password": "password123"
}
```

The login response contains a JWT access token. Use it for protected endpoints:

```text
Authorization: Bearer <token>
```

## Booking Endpoints

```text
POST   /bookings
GET    /bookings
GET    /bookings/:id
PATCH  /bookings/:id/status
DELETE /bookings/:id
```

Access to booking operations is controlled through JWT authentication and user roles.

## Database

PostgreSQL is used as the database and Prisma is used for database access and migrations.

Database configuration is provided through the project environment/configuration.

## Docker

The project includes `docker-compose.yml` for running PostgreSQL locally.

```bash
docker compose up -d
```

To stop the containers:

```bash
docker compose down
```
