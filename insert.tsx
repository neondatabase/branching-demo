import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DB_CONNECTION_STRING!)

async function some() {
  await sql(`INSERT INTO playing_with_neon(name, value) SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 1000000000) s(i);`)
}

some()
