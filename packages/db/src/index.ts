import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: path.resolve(process.cwd(), '../../.env'),
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });

export const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });