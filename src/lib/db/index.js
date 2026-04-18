import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

// Import SvelteKit's environment variable handler
import { env } from '$env/dynamic/private';

let _db = null;

function getDb() {
  if (_db) return _db;
  
  // Use SvelteKit's env object instead of process.env
  const url = env.TURSO_DATABASE_URL ?? '';
  const authToken = env.TURSO_AUTH_TOKEN ?? '';
  
  // Throw a clear error if it fails to load the URL, rather than letting Libsql crash
  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not set. Check your .env file.');
  }
  
  let client;
  if (url.startsWith('file:')) {
    client = createClient({ 
      url // No authToken needed for local files
    });
  } else {
    // For remote Turso databases
    client = createClient({ 
      url, 
      authToken 
    });
  }
  
  _db = drizzle(client, { schema });
  return _db;
}

// Proxy so callers can do `db.select()` etc. without calling getDb() themselves
export const db = new Proxy({}, {
  get(_, prop) {
    return getDb()[prop];
  }
});