# JWT In-Memory Token Sample

## Description

A full-stack sample application demonstrating JWT (JSON Web Token) authentication with **access tokens** and **refresh tokens** stored in memory on the frontend. This project showcases best practices for token-based authentication in modern web applications using React Router, TypeScript, and Node.js.

### Key Features

- **JWT Authentication**: Access tokens (short-lived) and refresh tokens (long-lived) for secure user sessions
- **In-Memory Token Storage**: Demonstrates storing tokens in memory on the client-side using a TokenService class
- **Protected Routes**: Dashboard and other routes protected by token validation
- **Login Flow**: Simple login interface that requests tokens from the server
- **Full-Stack Implementation**: 
  - Frontend: React with React Router 8, TypeScript, and Tailwind CSS
  - Backend: Express-based server with JSON Server for mock data, JWT signing, and token management
- **Refresh Token Rotation**: Server stores refresh tokens in memory for token renewal

## Technology Stack

- **Frontend**: React 19, React Router 8, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, JSON Server, jsonwebtoken
- **Authentication**: JWT (HS256 algorithm), Refresh Token Pattern
- **Styling**: Tailwind CSS

## Project Structure

```
├── app/
│   ├── routes/           # Route components (home, login, dashboard)
│   ├── utils/
│   │   ├── api.ts       # API utilities
│   │   └── tokenService.ts  # In-memory token management
│   ├── root.tsx         # Root layout component
│   └── routes.ts        # Route definitions
├── server/
│   ├── server.js        # Backend server with JWT logic
│   └── db.json          # Mock database
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

### Login

Default credentials can be set up in the backend. The application includes:
- **Home page**: Public landing page
- **Login page**: Authenticate with username and password
- **Dashboard**: Protected route accessible only with valid token

### Build and Deploy

```bash
npm run build    # Build for production
npm run start    # Serve the production build
```



