import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all folders for user
router.get('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;

  db.all(
    `SELECT f.*, COUNT(p.id) as place_count
     FROM folders f
     LEFT JOIN places p ON f.id = p.folder_id
     WHERE f.user_id = ?
     GROUP BY f.id
     ORDER BY f.created_at DESC`,
    [userId],
    (err: any, rows: any[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const folders = rows.map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        userId: row.user_id,
        placeCount: row.place_count,
        createdAt: row.created_at
      }));

      res.json({ folders });
    }
  );
});

// Create new folder
router.post('/', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO folders (id, user_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, userId, name, color || '#3B82F6', now],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        id,
        name,
        color: color || '#3B82F6',
        userId,
        placeCount: 0,
        createdAt: now
      });
    }
  );
});

// Update folder
router.put('/:id', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const folderId = req.params.id;
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  db.run(
    'UPDATE folders SET name = ?, color = ? WHERE id = ? AND user_id = ?',
    [name, color || '#3B82F6', folderId, userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }

      res.json({ message: 'Folder updated successfully' });
    }
  );
});

// Delete folder
router.delete('/:id', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const folderId = req.params.id;

  // First, unassign all places from this folder
  db.run(
    'UPDATE places SET folder_id = NULL WHERE folder_id = ? AND user_id = ?',
    [folderId, userId],
    (err: any) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Then delete the folder
      db.run(
        'DELETE FROM folders WHERE id = ? AND user_id = ?',
        [folderId, userId],
        function (err: any) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'Folder not found' });
          }

          res.json({ message: 'Folder deleted successfully' });
        }
      );
    }
  );
});

// Move place to folder
router.post('/:id/places/:placeId', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const folderId = req.params.id;
  const placeId = req.params.placeId;

  db.run(
    'UPDATE places SET folder_id = ? WHERE id = ? AND user_id = ?',
    [folderId, placeId, userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Place not found' });
      }

      res.json({ message: 'Place moved to folder successfully' });
    }
  );
});

// Remove place from folder
router.delete('/:id/places/:placeId', authenticateToken, (req: any, res: any) => {
  const userId = req.userId;
  const folderId = req.params.id;
  const placeId = req.params.placeId;

  db.run(
    'UPDATE places SET folder_id = NULL WHERE id = ? AND user_id = ? AND folder_id = ?',
    [placeId, userId, folderId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Place not found in folder' });
      }

      res.json({ message: 'Place removed from folder successfully' });
    }
  );
});

export default router;
