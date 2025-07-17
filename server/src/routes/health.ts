import { Router, Request, Response } from 'express';
import { pgDb } from '../database-pg';

const router = Router();

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: 'connected' | 'disconnected';
  memory: NodeJS.MemoryUsage;
  details?: any;
}

router.get('/health', async (req: Request, res: Response) => {
  const healthCheck: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'disconnected',
    memory: process.memoryUsage(),
  };

  try {
    // Check database connection
    const dbHealth = await pgDb.healthCheck();
    healthCheck.database = dbHealth.status === 'healthy' ? 'connected' : 'disconnected';

    if (dbHealth.status === 'unhealthy') {
      healthCheck.status = 'unhealthy';
      healthCheck.details = dbHealth.details;
    }
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.database = 'disconnected';
    healthCheck.details = {
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }

  // Set appropriate status code
  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Detailed health check for monitoring systems
router.get('/health/detailed', async (req: Request, res: Response) => {
  const start = Date.now();

  const detailedHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: 'unknown', latency: 0 },
      memory: { status: 'unknown', usage: process.memoryUsage() },
      disk: { status: 'unknown' },
    },
    system: {
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      environment: process.env.NODE_ENV || 'development',
    }
  };

  try {
    // Database health check
    const dbStart = Date.now();
    const dbHealth = await pgDb.healthCheck();
    detailedHealth.checks.database = {
      status: dbHealth.status,
      latency: Date.now() - dbStart,
      ...dbHealth.details
    };

    // Memory health check
    const memUsage = process.memoryUsage();
    const memoryHealthy = memUsage.heapUsed < (memUsage.heapTotal * 0.9);
    detailedHealth.checks.memory = {
      status: memoryHealthy ? 'healthy' : 'warning',
      usage: memUsage,
      heapUsedPercent: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    } as any;

    // Overall status
    const allHealthy = Object.values(detailedHealth.checks).every(
      check => check.status === 'healthy'
    );
    detailedHealth.status = allHealthy ? 'healthy' : 'unhealthy';

  } catch (error) {
    detailedHealth.status = 'unhealthy';
    detailedHealth.checks.database.status = 'error';
  }

  const statusCode = detailedHealth.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json({
    ...detailedHealth,
    responseTime: Date.now() - start
  });
});

// Readiness check (for Kubernetes/container orchestration)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if database is ready
    const dbHealth = await pgDb.healthCheck();

    if (dbHealth.status === 'healthy') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        reason: 'Database not available',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      reason: 'Service initialization failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (for Kubernetes/container orchestration)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
