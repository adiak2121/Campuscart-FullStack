# SSN CampusCart Tailwind Edition

Updated full-stack student marketplace with:

- React + TypeScript + Tailwind CSS + Vite
- Spring Boot
- MongoDB

## Improvements
- Tailwind CSS frontend
- Balanced homepage with **3 listings per section**
- Categories:
  - Food
  - Stationery
  - Textbooks
  - Clothing
  - Accessories
- Better seeded images and cleaner section layout
- SSN logo + white/blue theme
- Campus-only login with `@ssn.edu.in`

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Run backend
```bash
cd backend
mvn spring-boot:run
```

## Run backend first if you want seeded data
If old listings are still in MongoDB, clear the `ssncampuscartdb` database once so the new balanced seed data appears.


## JWT Authentication Update

This version uses JWT tokens for login.

### Student Login
- Endpoint: `POST /api/auth/login`
- Accepts only `@ssn.edu.in` emails.
- Returns:
  - `token`
  - `user`

The frontend stores the student session in `localStorage` as `campuscart-auth`.

### Admin Login
- Endpoint: `POST /api/admin/login`
- Default credentials:
  - Email: `admin@ssn.edu.in`
  - Password: `admin123`
- Returns:
  - `token`
  - `user`

The frontend stores the admin session in `localStorage` as `campuscart-admin`.

### Protected Admin APIs
Admin APIs now require:

```http
Authorization: Bearer <jwt-token>
```

Admin functions like listing deletion, order status update, and analytics are protected using the JWT admin role.
