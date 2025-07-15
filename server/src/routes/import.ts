import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { authenticateToken } from '../middleware/auth';
import csv from 'csv-parser';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Extract Google Place ID from URL
const extractPlaceId = (url: string): string | null => {
  const match = url.match(/1s0x[0-9a-f]+:0x[0-9a-f]+/);
  return match ? match[0] : null;
};

// Import from Google Takeout CSV
router.post('/google-takeout', authenticateToken, upload.single('file'), async (req: any, res: any) => {
  const userId = req.userId;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    let imported = 0;
    const errors: string[] = [];
    const places: any[] = [];

    // Parse CSV file
    const stream = fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Skip empty rows or header-like rows
        if (row.Title && row.URL && row.URL.includes('google.com/maps/place/')) {
          places.push({
            title: row.Title,
            note: row.Note || '',
            url: row.URL,
            tags: row.Tags || '',
            comment: row.Comment || ''
          });
        }
      })
      .on('end', async () => {
        try {
          // Process each place
          for (const place of places) {
            try {
              const id = uuidv4();
              const now = new Date().toISOString();
              const placeId = extractPlaceId(place.url);

              // For CSV import, we don't have precise coordinates
              // We'll use a default location (can be enhanced later with geocoding)
              const latitude = 0;
              const longitude = 0;

              await new Promise((resolve, reject) => {
                db.run(
                  'INSERT INTO places (id, user_id, name, address, latitude, longitude, place_id, url, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [id, userId, place.title, '', latitude, longitude, placeId, place.url, place.note + (place.comment ? ` | ${place.comment}` : ''), now, now],
                  function (err: any) {
                    if (err) {
                      errors.push(`Failed to import ${place.title}: ${err.message}`);
                      reject(err);
                    } else {
                      imported++;
                      resolve(true);
                    }
                  }
                );
              });

              // Handle tags as categories
              if (place.tags) {
                const tagNames = place.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);

                for (const tagName of tagNames) {
                  // Create or find category
                  const categoryId = uuidv4();
                  await new Promise((resolve) => {
                    db.run(
                      'INSERT OR IGNORE INTO categories (id, name, color, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
                      [categoryId, tagName, '#3B82F6', userId, now],
                      () => resolve(true)
                    );
                  });

                  // Link place to category
                  await new Promise((resolve) => {
                    db.run(
                      'INSERT OR IGNORE INTO place_categories (place_id, category_id) VALUES (?, (SELECT id FROM categories WHERE name = ? AND user_id = ?))',
                      [id, tagName, userId],
                      () => resolve(true)
                    );
                  });
                }
              }
            } catch (error: any) {
              errors.push(`Failed to import ${place.title}: ${error.message}`);
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(file.path);

          // Send response
          res.json({
            success: true,
            message: `Successfully imported ${imported} places`,
            imported,
            errors
          });

        } catch (error: any) {
          fs.unlinkSync(file.path);
          res.status(500).json({
            success: false,
            error: 'Processing failed: ' + error.message
          });
        }
      })
      .on('error', (error) => {
        fs.unlinkSync(file.path);
        res.status(400).json({
          success: false,
          error: 'Failed to parse CSV file: ' + error.message
        });
      });

  } catch (error: any) {
    // Clean up uploaded file
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }
    res.status(400).json({
      success: false,
      error: 'Failed to process file: ' + error.message
    });
  }
});

export default router;
