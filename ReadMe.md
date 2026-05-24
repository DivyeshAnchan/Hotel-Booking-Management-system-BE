# Hotel Booking Backend

Backend service for the Hotel Booking Management System built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- ES Modules

---

# Features

- Users Module
- Hotels Module
- Bookings Module
- Pagination
- Search
- Filters
- Sorting
- Aggregation Pipelines
- MongoDB Transactions
- Docker Support
- Seed Scripts

---

# Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Backend Runtime |
| Express.js | API Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Docker | Containerization |

---

# Requirements

Install:

- Node.js >= 22
- Docker Desktop

Official downloads:

```txt
https://nodejs.org
https://www.docker.com/products/docker-desktop
```

---

# Clone Project

```bash
git clone YOUR_BACKEND_REPO_URL
```

```bash
cd hotel-backend
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env`

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/hotel_booking

JWT_SECRET=hotel_booking_secret
```

---

# Run MongoDB Using Docker

```bash
docker run -d \
  --name hotel-mongo \
  -p 27017:27017 \
  -v hotel_mongo_data:/data/db \
  mongo:7
```

---

# Start Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Seed Database

## Seed Users

```bash
npm run seed:users
```

## Seed Hotels

```bash
npm run seed:hotels
```

## Seed Bookings

```bash
npm run seed:bookings
```

---

# API Base URL

```txt
http://localhost:5000/api
```

---

# Docker Build

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

---

# Build Docker Image

```bash
docker build -t hotel-backend .
```

---

# Run Docker Container

```bash
docker run -d \
  --name hotel-backend \
  -p 5000:5000 \
  --env-file .env \
  --add-host=host.docker.internal:host-gateway \
  hotel-backend
```

---

# Final URLs

Backend:

```txt
http://localhost:5000
```

MongoDB:

```txt
mongodb://localhost:27017/hotel_booking
```