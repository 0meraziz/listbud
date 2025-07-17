import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || './database.sqlite';

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          user_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Folders table
      db.run(`
        CREATE TABLE IF NOT EXISTS folders (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          user_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Places table
      db.run(`
        CREATE TABLE IF NOT EXISTS places (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          place_id TEXT,
          url TEXT,
          notes TEXT,
          rating REAL,
          folder_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (folder_id) REFERENCES folders (id)
        )
      `);

      // Place categories junction table
      db.run(`
        CREATE TABLE IF NOT EXISTS place_categories (
          place_id TEXT NOT NULL,
          category_id TEXT NOT NULL,
          PRIMARY KEY (place_id, category_id),
          FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )
      `);

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_places_user_id ON places(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_places_name ON places(name)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_places_folder_id ON places(folder_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id)`);

      resolve();
    });
  });
};

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
