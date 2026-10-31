import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'

// Load .env.local
const env = readFileSync('.env.local', 'utf8')
for (const line of env.split('\n')) {
  const match = line.match(/^([^=]+)="?(.*?)"?$/)
  if (match) process.env[match[1]] = match[2]
}

const sql = neon(process.env.DATABASE_URL)
const rows = await sql.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
)
console.log(rows)