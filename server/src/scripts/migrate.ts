import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

interface Migration {
  filename: string;
  sql: string;
}

class MigrationRunner {
  private pool: Pool;

  constructor() {
    // Use individual connection parameters for better compatibility
    this.pool = new Pool({
      user: 'listbud',
      host: 'localhost',
      database: 'listbud',
      password: 'listbud_dev_password',
      port: 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async createMigrationsTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.pool.query(createTableQuery);
    console.log('✅ Migrations table created/verified');
  }

  async getExecutedMigrations(): Promise<string[]> {
    const result = await this.pool.query('SELECT filename FROM migrations ORDER BY executed_at');
    return result.rows.map((row: any) => row.filename);
  }

  async executeMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      // Execute migration SQL
      await client.query(migration.sql);

      // Record migration as executed
      await client.query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [migration.filename]
      );

      await client.query('COMMIT');
      console.log(`✅ Executed migration: ${migration.filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to execute migration: ${migration.filename}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async loadMigrations(): Promise<Migration[]> {
    const migrationsDir = path.join(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    return files.map(filename => ({
      filename,
      sql: fs.readFileSync(path.join(migrationsDir, filename), 'utf8')
    }));
  }

  async runMigrations(): Promise<void> {
    try {
      console.log('🚀 Starting database migrations...');

      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();

      // Load all migration files
      const migrations = await this.loadMigrations();
      console.log(`📁 Found ${migrations.length} migration files`);

      // Get already executed migrations
      const executedMigrations = await this.getExecutedMigrations();
      console.log(`📋 Already executed: ${executedMigrations.length} migrations`);

      // Filter out already executed migrations
      const pendingMigrations = migrations.filter(
        migration => !executedMigrations.includes(migration.filename)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations to execute');
        return;
      }

      console.log(`⏳ Executing ${pendingMigrations.length} pending migrations...`);

      // Execute pending migrations
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }

      console.log('🎉 All migrations executed successfully!');

    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// CLI runner
async function main() {
  const runner = new MigrationRunner();

  try {
    await runner.runMigrations();
  } catch (error) {
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { MigrationRunner };
