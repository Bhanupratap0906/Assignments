# Library Management System - Client

This is the frontend for the Library Management System, built with React and Vite.

## Features

- Dashboard with book statistics
- Book management (add, edit, delete)
- Search and filter functionality
- Responsive design

## Tech Stack

- React 18
- React Router 6
- React Query
- Zustand for state management
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server on port 3001.

### Building for Production

To build the project for production:

```bash
npm run build
```

The build files will be generated in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/` - All source code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `store/` - Zustand store definitions
  - `utils/` - Utility functions and API services
  - `styles/` - Global CSS styles
  - `hooks/` - Custom React hooks
  - `context/` - React context definitions

## API Proxy

During development, API requests to `/api/*` are proxied to `http://127.0.0.1:5000` as defined in the Vite configuration. 