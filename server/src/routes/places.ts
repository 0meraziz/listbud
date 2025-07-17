import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all places for user
router.get('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;

  db.all(
    `SELECT p.*,
     GROUP_CONCAT(c.id) as category_ids,
     GROUP_CONCAT(c.name) as category_names,
     GROUP_CONCAT(c.color) as category_colors
     FROM places p
     LEFT JOIN place_categories pc ON p.id = pc.place_id
     LEFT JOIN categories c ON pc.category_id = c.id
     WHERE p.user_id = ?
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [userId],
    (err: any, rows: any[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const places = rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        address: row.address,
        latitude: row.latitude,
        longitude: row.longitude,
        placeId: row.place_id,
        url: row.url,
        rating: row.rating,
        notes: row.notes,
        folderId: row.folder_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        categories: row.category_ids ? row.category_ids.split(',').map((id: string, index: number) => ({
          id,
          name: row.category_names.split(',')[index],
          color: row.category_colors.split(',')[index]
        })) : []
      }));

      res.json({ places });
    }
  );
});

// Create new place
router.post('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { name, address, latitude, longitude, placeId, url, rating, notes, folderId } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'Name, address, latitude, and longitude are required' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO places (id, user_id, name, address, latitude, longitude, place_id, url, rating, notes, folder_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, userId, name, address, latitude, longitude, placeId, url, rating, notes, folderId, now, now],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id,
        userId,
        name,
        address,
        latitude,
        longitude,
        placeId,
        url,
        rating,
        notes,
        folderId,
        createdAt: now,
        updatedAt: now,
        categories: []
      });
    }
  );
});

// Search places
router.get('/search', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { query, categories } = req.query;

  let sql = `SELECT p.*,
             GROUP_CONCAT(c.id) as category_ids,
             GROUP_CONCAT(c.name) as category_names,
             GROUP_CONCAT(c.color) as category_colors
             FROM places p
             LEFT JOIN place_categories pc ON p.id = pc.place_id
             LEFT JOIN categories c ON pc.category_id = c.id
             WHERE p.user_id = ?`;

  const params = [userId];

  if (query) {
    sql += ' AND (p.name LIKE ? OR p.address LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }

  if (categories && categories.length > 0) {
    const categoryIds = categories.split(',');
    sql += ` AND p.id IN (SELECT place_id FROM place_categories WHERE category_id IN (${categoryIds.map(() => '?').join(',')}))`;
    params.push(...categoryIds);
  }

  sql += ' GROUP BY p.id ORDER BY p.created_at DESC';

  db.all(sql, params, (err: any, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const places = rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      placeId: row.place_id,
      url: row.url,
      rating: row.rating,
      notes: row.notes,
      folderId: row.folder_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      categories: row.category_ids ? row.category_ids.split(',').map((id: string, index: number) => ({
        id,
        name: row.category_names.split(',')[index],
        color: row.category_colors.split(',')[index]
      })) : []
    }));

    res.json({ places });
  });
});

// Delete single place
router.delete('/:id', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const placeId = req.params.id;

  db.run(
    'DELETE FROM places WHERE id = ? AND user_id = ?',
    [placeId, userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Place not found' });
      }

      res.json({ message: 'Place deleted successfully' });
    }
  );
});

// Delete all places for user
router.delete('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;

  db.run(
    'DELETE FROM places WHERE user_id = ?',
    [userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        message: 'All places deleted successfully',
        deletedCount: this.changes
      });
    }
  );
});

export default router;
