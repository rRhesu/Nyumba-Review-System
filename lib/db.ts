import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { pool?: Pool }

export const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export async function query<T extends Record<string, unknown>>(text: string, values: unknown[] = []) {
  const result = await pool.query<T>(text, values)
  return result.rows
}
