# Book Management System

A full-stack application for managing a library of books with borrowing functionality.

## Features

- **Book Management**: Add, edit, delete, and view books
- **User Management**: Track users who borrow books
- **Borrow/Return**: Allow users to borrow and return books
- **Validation**: Client and server-side validation with the same logic
- **Responsive UI**: Works on mobile, tablet, and desktop

## Tech Stack

### Frontend

- React 18
- React Router for navigation
- Zustand for state management
- React Query for data fetching
- Custom CSS (no UI libraries)
- Webpack for bundling

### Backend

- Node.js with Express
- In-memory data storage
- RESTful API
- Validation middleware

## Project Structure

```
/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   ├── styles/      # Global styles
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json     # Frontend dependencies
│
├── server/              # Backend Express application
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── middlewares/ # Middleware functions
│   │   ├── utils/       # Utility functions
│   │   └── index.js     # Entry point
│   └── package.json     # Backend dependencies
│
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd library-management-app
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `GET /api/books/:id` - Get a single book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `POST /api/users/:id/borrow` - Borrow a book
- `POST /api/users/:id/return` - Return a book 