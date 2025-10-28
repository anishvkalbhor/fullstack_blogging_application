import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv'; // Import all of dotenv

// Specify the path to the root .env file
// Note: This one goes up TWO levels (from /src/index.ts to the root)
dotenv.config({ path: '../../.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

// for query
const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

// for migrations
export const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });