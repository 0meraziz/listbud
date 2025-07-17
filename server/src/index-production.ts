import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { pgDb } from './database-pg';
import {
  securityMiddleware,
  authRateLimit,
  sanitizeInput,
  requestLogger,
  errorHandler,
  securityHeaders
} from './middleware/security';

// Import routes
import authRoutes from './routes/auth';
import placesRoutes from './routes/places';
import categoriesRoutes from './routes/categories';
import importRoutes from './routes/import';
import healthRoutes from './routes/health';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Railway/Heroku deployment
app.set('trust proxy', 1);

// Security headers
app.use(securityHeaders);

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// Security middleware
app.use(securityMiddleware);

// Input sanitization
app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json({
  limit: process.env.FILE_UPLOAD_MAX_SIZE || '10mb',
  type: ['application/json', 'application/json; charset=utf-8']
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check routes (before auth)
app.use('/', healthRoutes);

// API routes
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/import', importRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: process.env.APP_NAME || 'ListBud Server',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database initialization and server startup
async function startServer() {
  try {
    console.log(`🚀 Starting ${process.env.APP_NAME || 'ListBud Server'} in ${process.env.NODE_ENV || 'development'} mode...`);

    // Initialize database based on environment
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      console.log('🔧 Using PostgreSQL database for production');
      // Run migrations in production
      const { MigrationRunner } = await import('./scripts/migrate');
      const migrationRunner = new MigrationRunner();
      await migrationRunner.runMigrations();
      await migrationRunner.close();
      console.log('✅ Database migrations completed');
    } else {
      console.log('🔧 Using SQLite database for development');
      await initializeDatabase();
      console.log('✅ SQLite database initialized');
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📡 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('💤 Server closed');
        if (process.env.NODE_ENV === 'production') {
          pgDb.close();
        }
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📡 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('💤 Server closed');
        if (process.env.NODE_ENV === 'production') {
          pgDb.close();
        }
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
