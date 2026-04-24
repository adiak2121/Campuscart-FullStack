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
