const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Add security headers
const compression = require('compression'); // Gzip compression
require('dotenv').config();

// Import database connection
const connectDatabase = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDatabase();

// Security and performance middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip compression
}

// CORS Configuration for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'] // For pagination
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Basic route - API info
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bug Tracker API is running! 🐛',
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas Cloud ☁️'
  });
});

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'Disconnected',
      1: 'Connected', 
      2: 'Connecting',
      3: 'Disconnecting'
    };

    // Try to ping the database
    let dbPing = false;
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = true;
    } catch (pingError) {
      dbPing = false;
    }

    res.json({
      status: dbStatus === 1 && dbPing ? 'OK' : 'WARNING',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStates[dbStatus],
        ping: dbPing ? 'Success' : 'Failed',
        host: mongoose.connection.host || 'Unknown'
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.API_VERSION || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: error.message
    });
  }
});

// API Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/bugs', require('./routes/bugRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
} catch (routeError) {
  console.error('❌ Error loading routes:', routeError.message);
  console.error('💡 Make sure all route files exist in the ./routes directory');
}

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found 🔍',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/bugs',
      'POST /api/bugs',
      'GET /api/users'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      field: field,
      timestamp: new Date().toISOString()
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid authentication token',
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Authentication token has expired',
      timestamp: new Date().toISOString()
    });
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'CORS policy violation',
      error: 'Origin not allowed',
      timestamp: new Date().toISOString()
    });
  }
  
  // Generic server error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`   Bug Tracker API Server Started`);
  console.log('   ================================');
  console.log(`📱 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🌐 CORS Origins: ${process.env.CORS_ORIGINS || 'localhost:3000'}`);
  console.log(`📊 Database: MongoDB Atlas Cloud`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error('🔄 Shutting down server...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error('🔄 Shutting down server...');
  process.exit(1);
});

module.exports = app;
