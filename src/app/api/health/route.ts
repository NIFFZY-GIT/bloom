import { NextResponse } from 'next/server';
import { Pool } from 'pg';

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Returns system health status including:
 * - API availability
 * - Database connection
 * - Environment configuration
 */
export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      api: true,
      database: false,
      email: false,
    },
    version: '1.0.0',
  };

  // Check database connection
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1, // Only need one connection for health check
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();

    healthCheck.checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
    healthCheck.checks.database = false;
    healthCheck.status = 'degraded';
  }

  // Check email configuration
  try {
    const emailConfigured = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    );
    healthCheck.checks.email = emailConfigured;

    if (!emailConfigured) {
      healthCheck.status = 'degraded';
    }
  } catch (error) {
    console.error('Email config check failed:', error);
    healthCheck.checks.email = false;
  }

  // Return appropriate status code
  const statusCode = healthCheck.status === 'ok' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}
