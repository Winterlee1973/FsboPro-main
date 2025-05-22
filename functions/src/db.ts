import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
// Import all table objects and other necessary exports from the schema
import * as schema from "./shared/schema";

neonConfig.webSocketConstructor = ws;

console.log("DATABASE_URL:", process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Pass the imported schema module directly to Drizzle
export const db = drizzle({ client: pool, schema });