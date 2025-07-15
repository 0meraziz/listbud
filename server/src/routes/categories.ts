import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all categories for user
router.get('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;

  db.all(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err: any, rows: any[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ categories: rows });
    }
  );
});

// Create new category
router.post('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { name, color } = req.body;

  if (!name || !color) {
    return res.status(400).json({ error: 'Name and color are required' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO categories (id, name, color, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, name, color, userId, now],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id,
        name,
        color,
        userId,
        createdAt: now
      });
    }
  );
});

// Add category to place
router.post('/:categoryId/places/:placeId', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { categoryId, placeId } = req.params;

  // First verify both category and place belong to the user
  db.get(
    'SELECT 1 FROM categories WHERE id = ? AND user_id = ?',
    [categoryId, userId],
    (err: any, categoryRow: any) => {
      if (err || !categoryRow) {
        return res.status(404).json({ error: 'Category not found' });
      }

      db.get(
        'SELECT 1 FROM places WHERE id = ? AND user_id = ?',
        [placeId, userId],
        (err: any, placeRow: any) => {
          if (err || !placeRow) {
            return res.status(404).json({ error: 'Place not found' });
          }

          // Add the relationship
          db.run(
            'INSERT OR IGNORE INTO place_categories (place_id, category_id) VALUES (?, ?)',
            [placeId, categoryId],
            function (err: any) {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.json({ message: 'Category added to place successfully' });
            }
          );
        }
      );
    }
  );
});

// Remove category from place
router.delete('/:categoryId/places/:placeId', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { categoryId, placeId } = req.params;

  // Verify ownership through places table
  db.run(
    'DELETE FROM place_categories WHERE place_id = ? AND category_id = ? AND place_id IN (SELECT id FROM places WHERE user_id = ?)',
    [placeId, categoryId, userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Category removed from place successfully' });
    }
  );
});

export default router;
