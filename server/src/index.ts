import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import { initializeDatabase } from './database';
import authRoutes from './routes/auth';
import placesRoutes from './routes/places';
import categoriesRoutes from './routes/categories';
import foldersRoutes from './routes/folders';
import importRoutes from './routes/import';
import healthRoutes from './routes/health';
import { errorHandler, notFoundHandler, handleUnhandledRejection, handleUncaughtException } from './middleware/errorHandler';
import { logInfo, logError } from './utils/logger';

// Load environment variables
require('dotenv').config();

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException();
handleUnhandledRejection();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// HTTP request logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/import', importRoutes);
app.use('/', healthRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    logInfo('Database initialized successfully');

    app.listen(PORT, () => {
      logInfo(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logInfo('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logInfo('SIGINT received, shutting down gracefully');
  process.exit(0);
});
