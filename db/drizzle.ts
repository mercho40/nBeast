import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Optimize connection pool for serverless
  max: 1, // Single connection for serverless functions
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  connectionTimeoutMillis: 2000, // 2 seconds connection timeout
});

export const db = drizzle({ client: pool, schema: schema });

