# Library Management System

A full-stack library management application built with React, TypeScript, Node.js, Express, and MongoDB.

## Prerequisites

Before running the application, make sure you have installed:

* [Node.js](https://nodejs.org/) (LTS recommended)
* npm (included with Node.js)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
* Git

## Features

* User registration and login
* JWT-based authentication
* Browse and search books
* Borrow and manage borrowed books
* Admin-only book management
* View borrowing records
* MongoDB database integration

## Project Structure

```text
library-management-system/
├── client/                 # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .gitignore
├── server/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/alexestrada1/library-management-system.git
cd library-management-system
```

### 2. Configure the backend

Navigate to the server directory:

```bash
cd server
```

Install the backend dependencies:

```bash
npm install
```

Create a `.env` file by copying the example configuration.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Open `server/.env` and configure the environment variables:

```dotenv
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Replace the MongoDB connection string with your actual connection string. Set `JWT_SECRET` to a long, randomly generated secret.

Keep `.env` private and never commit it to Git.

### 3. Configure MongoDB

You can use MongoDB Atlas or a local MongoDB instance.

For MongoDB Atlas:

1. Create a cluster and a database user.
2. Configure your network access to allow connections from your development machine.
3. Copy your connection string.
4. Put the connection string in `MONGO_URI` in `server/.env`.

Make sure your connection string contains the correct database credentials and URL-encodes special characters in the password when necessary.

### 4. Start the backend server

From the `server` directory, run:

```bash
npm run dev
```

The backend should start at:

```text
http://localhost:5000
```

You can check the health endpoint at:

```text
http://localhost:5000/api/health
```

### 5. Start the frontend

Open a **second terminal** in the project root and navigate to the client directory:

```bash
cd client
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend is typically available at:

```text
http://localhost:5173
```

Open that address in your browser to use the application.

## Environment Variables

The backend uses the following environment variables:

| Variable     | Description                                 |
| ------------ | ------------------------------------------- |
| `PORT`       | Port used by the Express server             |
| `MONGO_URI`  | MongoDB connection string                   |
| `JWT_SECRET` | Secret used to sign and verify JWTs         |
| `CLIENT_URL` | Frontend origin used for CORS configuration |

## Development Commands

### Backend (`server/`)

```bash
npm run dev
npm run build
npm start
```

* `npm run dev` starts the development server with automatic reloads.
* `npm run build` compiles the TypeScript backend.
* `npm start` runs the compiled backend.

### Frontend (`client/`)

```bash
npm run dev
npm run build
npm run preview
```

* `npm run dev` starts the Vite development server.
* `npm run build` builds the frontend for production.
* `npm run preview` previews the production build locally.

## Security Notes

* Never commit `.env` files or real credentials.
* Use a strong, randomly generated JWT secret.
* Keep MongoDB credentials private.
* Configure production environment variables separately from local development settings.

## License

No license has been specified for this project yet.
