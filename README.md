# 🚀 MERN Stack Task Manager - DevOps & Deployment Assignment

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) with comprehensive DevOps and deployment setup.

## 📋 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Task Management**: Full CRUD operations for tasks with status and priority tracking
- **Dashboard**: Real-time statistics and task overview
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Code Splitting**: Optimized React application with lazy loading
- **API Security**: Rate limiting, CORS, and input validation
- **Health Monitoring**: Comprehensive health check endpoints
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions

## 🏗️ Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main application component
│   └── public/           # Static assets
├── server/                # Express.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── tests/           # Unit tests
├── .github/workflows/    # GitHub Actions CI/CD
├── deployment/           # Deployment configurations
└── monitoring/           # Health check scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-deployment-assignment
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run install-all      # Install all dependencies
npm run test            # Run all tests
npm run lint            # Run linting

# Backend (server/)
npm run dev             # Start backend with nodemon
npm run test            # Run backend tests
npm run lint            # Run backend linting

# Frontend (client/)
npm start               # Start React development server
npm run build           # Build for production
npm test                # Run frontend tests
npm run lint            # Run frontend linting
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create a Render account** at [render.com](https://render.com)

2. **Connect your GitHub repository**

3. **Create a new Web Service**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment: `Node`

4. **Set environment variables**
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-atlas-connection-string`
   - `JWT_SECRET=your-production-jwt-secret`
   - `FRONTEND_URL=https://your-frontend-domain.com`

5. **Deploy**
   - Render will automatically deploy on every push to main branch

### Frontend Deployment (Vercel)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**

3. **Configure build settings**
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Set environment variables**
   - `REACT_APP_API_URL=https://your-backend-domain.com/api`

5. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Alternative Deployment Options

#### Backend Alternatives
- **Railway**: Similar to Render, great for Node.js apps
- **Heroku**: Well-established platform with extensive documentation
- **DigitalOcean App Platform**: Scalable and reliable

#### Frontend Alternatives
- **Netlify**: Great for static sites with good CI/CD
- **GitHub Pages**: Free hosting integrated with GitHub
- **Firebase Hosting**: Google's hosting solution

## 🔧 CI/CD Pipeline

The project includes GitHub Actions workflows for automated testing and deployment:

### Workflow Features
- **Automated Testing**: Runs tests on every push and pull request
- **Code Quality**: ESLint checks for code quality
- **Build Verification**: Ensures both frontend and backend build successfully
- **Health Checks**: Verifies application health after deployment
- **Multi-Environment**: Supports staging and production deployments

### Workflow Files
- `.github/workflows/mern-ci-cd.yml`: Main CI/CD pipeline
- `.github/workflows/classroom.yml`: GitHub Classroom integration

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `/api/health`
- **Response**: Application status, uptime, database connection, memory usage

### Monitoring Scripts
- `monitoring/health-check.js`: Comprehensive health check utility
- Automated health checks in CI/CD pipeline

### Manual Health Check
```bash
node monitoring/health-check.js
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

### Test Coverage
- Unit tests for API endpoints
- Integration tests for database operations
- Component tests for React components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Express-validator for API input sanitization
- **Rate Limiting**: Prevents abuse with express-rate-limit
- **CORS Configuration**: Proper cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Environment Variables**: Secure configuration management

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: React.lazy() for component lazy loading
- **Bundle Optimization**: Webpack optimizations in production build
- **Caching**: Static asset caching strategies
- **Image Optimization**: Optimized images and icons

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Compression**: gzip compression for API responses
- **Caching**: Response caching where appropriate

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running locally
   - Check connection string in environment variables
   - Ensure network access for Atlas connections

2. **JWT Token Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Ensure proper token format in requests

3. **CORS Errors**
   - Verify FRONTEND_URL is set correctly
   - Check CORS configuration in server.js
   - Ensure proper origin settings

4. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are installed
   - Check for syntax errors in code

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
REACT_APP_DEBUG=true npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Task Endpoints
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Health Endpoints
- `GET /api/health` - Application health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) and [Render](https://render.com/) for hosting

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the deployment documentation

---

**Note**: This is a Week 7 DevOps and Deployment assignment for the MERN stack course. The application demonstrates modern deployment practices, CI/CD pipelines, and production-ready configurations. 