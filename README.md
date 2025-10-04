# DevOdyssey

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5+-black.svg)](https://expressjs.com/)

A modern, SEO-optimized blog platform built with the MERN stack, designed for developers to share insights, tutorials, and experiences in web development, technology, and beyond.

## Overview

DevOdyssey is a comprehensive blogging platform that combines powerful content management capabilities with a sleek, responsive user interface. Built with modern web technologies, it provides an optimal experience for both content creators and readers.

## Features

- **Modern Architecture**: Built with MERN stack (MongoDB, Express.js, React, Node.js)
- **SEO Optimized**: Enhanced for search engine visibility and performance
- **Responsive Design**: Optimized for all device sizes and screen resolutions
- **User Authentication**: Secure JWT-based authentication system
- **State Management**: Redux Toolkit for predictable state updates
- **Performance**: Optimized bundle sizes and lazy loading

## Technology Stack

### Frontend

- **React 18+** with Vite for fast development and building
- **Tailwind CSS** for utility-first styling
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **Axios** for HTTP requests
- **Driver.js** for interactive user tours

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing

### Development & Deployment

- **Vite** for fast development server and building
- **ESLint** and **Prettier** for code quality
- **Vercel** for frontend deployment
- **Render** for backend deployment
- **Environment variables** for configuration management

## Project Structure
```bash
devodyssey/
├── client/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── server/                 # Express backend application
│   ├── package.json
│   └── README.md
├── License               # License
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or cloud instance like MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**

    ```bash
    git clone [https://github.com/aaditya-dubey09/devodyssey.git](https://github.com/aaditya-dubey09/devodyssey.git)
    cd devodyssey
    ```

2. **Install dependencies**

    ```bash
    # Install root dependencies (if any, e.g., concurrently)
    npm install
    
    # Install client dependencies
    cd client
    npm install
    
    # Install server dependencies
    cd ../server
    npm install
    ```

3. **Environment Setup**

    Create `.env` files in both `client` and `server` directories:

    **Server (`server/.env`)**:

    ```env
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/devodyssey  # Or your MongoDB Atlas URI
    JWT_SECRET=your_jwt_secret_here
    JWT_EXPIRE=7d
    ```

    **Client (`client/.env`)**:

    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_NODE_ENV=development
    ```

4. **Start the Development Servers**

    From the root directory:

    ```bash
    # Start both client and server concurrently (requires 'concurrently' package installed at root)
    npm run dev
    ```

    Or start them separately:

    ```bash
    # Terminal 1 - Start server
    cd server
    npm run dev
    
    # Terminal 2 - Start client
    cd client
    npm run dev
    ```

5. **Access the Application**
    - Frontend: `http://localhost:5173` (Vite's default port, might vary)
    - Backend API: `http://localhost:5000`
    - API Documentation: `http://localhost:5000/api-docs` (if implemented)

## Available Scripts

### Root Directory

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start the production server (often handled by deployment platforms)
- `npm run test` - Run tests for both client and server

### Client Directory

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Directory

- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run test` - Run server tests

## API Documentation

The backend provides a RESTful API with the following main endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Retrieve blog posts
- `POST /api/posts` - Create new blog post
- `PUT /api/posts/:id` - Update blog post
- `DELETE /api/posts/:id` - Delete blog post

For detailed API documentation, please refer to the [server README](./server/README.md).

## Contributors

<a href="https://github.com/aaditya-dubey09/devodyssey/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aaditya-dubey09/devodyssey" />
</a>

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Follow the [Contribution](CONTRIBUTING.md) guidelines
- Maintain [Code of conduct](CODE_OF_CONDUCT.md)

## Deployment

### Frontend (Vercel)

The frontend is deployed on [Vercel](https://vercel.com/). Vercel automatically deploys new changes pushed to the `main` branch.

1. Ensure your `client` directory is correctly configured as the **Root Directory** in your Vercel project settings.
2. Set the `VITE_API_URL` environment variable on Vercel to your deployed backend URL (e.g., `https://your-backend-name.onrender.com/api`).
    - **Key**: `VITE_API_URL`
    - **Value**: `https://devodyssey-backend.onrender.com/api` (Replace `devodyssey-backend.onrender.com` with your actual Render backend URL)

### Backend (Render)

The backend is deployed on [Render](https://render.com/). Render automatically deploys new changes pushed to the `main` branch.

1. Ensure your `server` directory is correctly configured as the **Root Directory** in your Render service settings.
2. Set the following environment variables on Render:
    - **Key**: `NODE_ENV`, **Value**: `production`
    - **Key**: `PORT`, **Value**: `5000` (Render will use its own internal port, but your app should still listen on `process.env.PORT` or `5000` as a fallback)
    - **Key**: `MONGODB_URI`, **Value**: `your_mongodb_atlas_connection_string` (from MongoDB Atlas)
    - **Key**: `JWT_SECRET`, **Value**: `your_jwt_secret_here` (match this with your client's JWT secret if applicable)
    - **Key**: `JWT_EXPIRE`, **Value**: `7d`
3. Configure a **Health Check Path** (e.g., `/api/health`) for better service monitoring.
4. Set **Build Filters (Included Paths)** to `server` to only trigger backend builds on relevant changes.

## Roadmap

- [ ] Advanced SEO features
- [ ] Follow System
- [ ] Text Editor
- [ ] Blog Saving Option
- [ ] Progressive Web App (PWA) features

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/aaditya-dubey09/devodyssey/issues) page
2. Create a new issue if your problem isn't already documented
3. Provide as much detail as possible, including error messages and steps to reproduce

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the developer community's need for quality blogging platforms
- Special thanks to all contributors and the open-source community

---

**Author**: [Aaditya Dubey](https://github.com/aaditya-dubey09)

**Live Demo**: [DevOdyssey](https://devodyssey.vercel.app)

For more detailed information about the client or server setup, please refer to their respective README files.
