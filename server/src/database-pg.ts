import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

class PostgreSQLDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'listbud',
      host: 'localhost',
      database: 'listbud',
      password: 'listbud_dev_password',
      port: 5432,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text, duration, rows: res.rowCount });
      }

      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details?: any }> {
    try {
      const result = await this.query('SELECT 1 as health_check');
      return {
        status: 'healthy',
        details: {
          connection: 'active',
          query_result: result.rows[0]
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // User operations
  async createUser(email: string, name: string, passwordHash: string): Promise<string> {
    const id = uuidv4();
    await this.query(
      'INSERT INTO users (id, email, name, password_hash) VALUES ($1, $2, $3, $4)',
      [id, email, name, passwordHash]
    );
    return id;
  }

  async getUserByEmail(email: string): Promise<any> {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async getUserById(id: string): Promise<any> {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Category operations
  async createCategory(userId: string, name: string, color: string): Promise<string> {
    const id = uuidv4();
    await this.query(
      'INSERT INTO categories (id, user_id, name, color) VALUES ($1, $2, $3, $4)',
      [id, userId, name, color]
    );
    return id;
  }

  async getCategories(userId: string): Promise<any[]> {
    const result = await this.query('SELECT * FROM categories WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async getCategoryById(id: string): Promise<any> {
    const result = await this.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Place operations
  async createPlace(placeData: {
    userId: string;
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    placeId?: string;
    url?: string;
    notes?: string;
    rating?: number;
    sourceList?: string;
  }): Promise<string> {
    const id = uuidv4();
    await this.query(`
      INSERT INTO places (id, user_id, name, address, latitude, longitude, place_id, url, notes, rating, source_list)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      id,
      placeData.userId,
      placeData.name,
      placeData.address || null,
      placeData.latitude || 0,
      placeData.longitude || 0,
      placeData.placeId || null,
      placeData.url || null,
      placeData.notes || null,
      placeData.rating || null,
      placeData.sourceList || null
    ]);
    return id;
  }

  async getPlaces(userId: string): Promise<any[]> {
    const result = await this.query(`
      SELECT p.*,
             COALESCE(
               json_agg(
                 CASE WHEN c.id IS NOT NULL THEN
                   json_build_object('id', c.id, 'name', c.name, 'color', c.color)
                 END
               ) FILTER (WHERE c.id IS NOT NULL),
               '[]'
             ) as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [userId]);
    return result.rows;
  }

  async getPlaceById(id: string): Promise<any> {
    const result = await this.query(`
      SELECT p.*,
             COALESCE(
               json_agg(
                 CASE WHEN c.id IS NOT NULL THEN
                   json_build_object('id', c.id, 'name', c.name, 'color', c.color)
                 END
               ) FILTER (WHERE c.id IS NOT NULL),
               '[]'
             ) as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    return result.rows[0];
  }

  async updatePlace(id: string, updates: Record<string, any>): Promise<void> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    await this.query(
      `UPDATE places SET ${setClause} WHERE id = $1`,
      [id, ...Object.values(updates)]
    );
  }

  async deletePlace(id: string): Promise<void> {
    await this.query('DELETE FROM places WHERE id = $1', [id]);
  }

  async searchPlaces(userId: string, query: string, categoryIds: string[] = []): Promise<any[]> {
    let sql = `
      SELECT DISTINCT p.*,
             COALESCE(
               json_agg(
                 CASE WHEN c.id IS NOT NULL THEN
                   json_build_object('id', c.id, 'name', c.name, 'color', c.color)
                 END
               ) FILTER (WHERE c.id IS NOT NULL),
               '[]'
             ) as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.user_id = $1
    `;

    const params: any[] = [userId];

    if (query) {
      sql += ` AND (
        p.name ILIKE $${params.length + 1} OR
        p.address ILIKE $${params.length + 1} OR
        p.notes ILIKE $${params.length + 1}
      )`;
      params.push(`%${query}%`);
    }

    if (categoryIds.length > 0) {
      sql += ` AND EXISTS (
        SELECT 1 FROM place_categories pc2
        WHERE pc2.place_id = p.id
        AND pc2.category_id = ANY($${params.length + 1}::text[])
      )`;
      params.push(categoryIds);
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const result = await this.query(sql, params);
    return result.rows;
  }

  // Place-Category associations
  async addPlaceToCategory(placeId: string, categoryId: string): Promise<void> {
    await this.query(
      'INSERT INTO place_categories (place_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [placeId, categoryId]
    );
  }

  async removePlaceFromCategory(placeId: string, categoryId: string): Promise<void> {
    await this.query(
      'DELETE FROM place_categories WHERE place_id = $1 AND category_id = $2',
      [placeId, categoryId]
    );
  }

  async setPlaceCategories(placeId: string, categoryIds: string[]): Promise<void> {
    await this.transaction(async (client) => {
      // Remove existing associations
      await client.query('DELETE FROM place_categories WHERE place_id = $1', [placeId]);

      // Add new associations
      if (categoryIds.length > 0) {
        const values = categoryIds.map((categoryId, index) =>
          `($1, $${index + 2})`
        ).join(', ');

        await client.query(
          `INSERT INTO place_categories (place_id, category_id) VALUES ${values}`,
          [placeId, ...categoryIds]
        );
      }
    });
  }
}

export const pgDb = new PostgreSQLDatabase();
export default PostgreSQLDatabase;
