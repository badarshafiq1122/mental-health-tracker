# Mental Health Tracker

A full-stack web application designed to help users log and analyze their mental health metrics. The app supports tracking mood, anxiety, sleep quality, physical activity, social engagement, stress, and symptoms, providing real-time visualization of trends and secure Google-based authentication.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [API Reference](#api-reference)
- [WebSocket Functionality](#websocket-functionality)
- [Environment Variables](#environment-variables)
---

## Overview

Mental Health Tracker provides a secure, user-friendly platform for individuals to track daily mental health through mood, anxiety, sleep, physical activity, social interaction, stress, and symptoms. Real-time updates via WebSocket allow users to monitor their trends instantly across devices.

The project is organized as a monorepo with React (Vite) frontend and Node.js (Express) backend, enabling clear separation of concerns and smooth development workflow.

---

## Features

- Secure user authentication using **Google OAuth 2.0**.
- Comprehensive daily mental health logging.
- Interactive charts for weekly and monthly trends.
- Real-time updates using WebSocket.
- Responsive, accessible UI with modals, tooltips, and transitions.
- Export logs as JSON or CSV for offline use.

---

## Tech Stack

**Frontend**

- React 18 with Hooks and Context API
- Vite bundler
- Material UI components
- Chart.js for data visualization
- React Hook Form for form management
- WebSocket client

**Backend**

- Node.js with Express.js
- SQLite database via Prisma ORM
- JWT authentication
- WebSocket server with `ws`
- Joi validation
- Security middleware (Helmet, CORS)

**Dev Tools**

- ESLint and Prettier for linting and formatting
- Nodemon for backend auto-reload
- Concurrently to run backend and frontend together
- Jest, React Testing Library, Supertest for testing

---

## Project Structure

```

mental-health-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── websocket/
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── database.sqlite
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.production
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md

````

---

## Setup Instructions

### Prerequisites

- Node.js v14 or later
- npm v6 or later
- Google Cloud project with OAuth 2.0 credentials

---

### Installation


1. Install root dependencies (for workspaces):

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

---

### Environment Configuration

Copy `.env.example` files in both `backend` and `frontend` folders and update them with your credentials.

**Backend `.env`**

```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

**Frontend `.env.development`**

```ini
VITE_APP_NAME="Mental Health Tracker"
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Running the Application

### Development Mode

Start backend and frontend concurrently from the root directory:

```bash
npm run dev:all
```

Or start them individually:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Backend runs on `http://localhost:5000` and frontend on `http://localhost:5173`.

---

### Production Mode

Build frontend static assets:

```bash
cd frontend
npm run build
```

Start backend production server:

```bash
cd backend
npm start
```

The backend can be configured to serve the frontend build or serve separately on production infrastructure.

---

## API Reference

Key endpoints:

| Method | Endpoint               | Description             | Auth Required |
| ------ | ---------------------- | ----------------------- | ------------- |
| GET    | `/health`              | Health check            | No            |
| POST   | `/api/auth/google`     | Google authentication   | No            |
| GET    | `/api/auth/me`         | Current user profile    | Yes           |
| POST   | `/api/logs`            | Create/update daily log | Yes           |
| GET    | `/api/logs`            | Retrieve all user logs  | Yes           |
| GET    | `/api/logs/:id`        | Get log by ID           | Yes           |
| DELETE | `/api/logs/:id`        | Delete log by ID        | Yes           |
| GET    | `/api/analytics/mood`  | Mood trend analysis     | Yes           |
| GET    | `/api/analytics/sleep` | Sleep stats             | Yes           |
| GET    | `/api/export/json`     | Export logs as JSON     | Yes           |
| GET    | `/api/export/csv`      | Export logs as CSV      | Yes           |

---

## WebSocket Functionality

* WebSocket server sends live notifications for log creation, updates, and deletions.
* Client listens for events: `LOG_CREATE`, `LOG_UPDATE`, `LOG_DELETE`, and connection status messages.
* Enables instant UI updates without page reloads.

---