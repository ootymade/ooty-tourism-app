import * as SQLite from 'expo-sqlite';
import { Attraction, attractionsContent } from '../data';

const DB_NAME = 'ootymade.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

// Attractions are seeded from the bundled seed data on first run, so the
// directory works fully offline. Once Supabase is live, a sync step will
// replace this seed step with a fetch-and-upsert against the same table —
// everything that reads from getAllAttractions() stays unchanged.
export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS attractions (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      last_verified TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM attractions');
  const isEmpty = !row || row.count === 0;

  if (isEmpty) {
    await db.withTransactionAsync(async () => {
      for (const attraction of attractionsContent.attractions) {
        await db.runAsync(
          'INSERT OR REPLACE INTO attractions (id, data, last_verified) VALUES (?, ?, ?)',
          attraction.id,
          JSON.stringify(attraction),
          attractionsContent.lastVerified
        );
      }
    });
  }
}

export async function getAllAttractions(): Promise<Attraction[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.getAllAsync<{ data: string }>('SELECT data FROM attractions');
  return rows.map((row) => JSON.parse(row.data) as Attraction);
}

export async function getAttractionById(id: string): Promise<Attraction | null> {
  await initDb();
  const db = await getDb();
  const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM attractions WHERE id = ?', id);
  return row ? (JSON.parse(row.data) as Attraction) : null;
}
