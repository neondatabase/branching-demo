import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { generateUsername } from 'unique-username-generator'

const sql = neon(process.env.DB_CONNECTION_STRING!)

const prepareRows = new Array(1000).fill(0).map((_, id) => ({ id, name: generateUsername() }))

async function populate() {
  await sql(`DROP TABLE playing_with_neon`)
  await sql(`CREATE TABLE playing_with_neon (id INTEGER PRIMARY KEY, name TEXT)`)
  await sql.transaction(prepareRows.map((item) => sql(`INSERT INTO playing_with_neon (id, name) VALUES (${item.id}, '${item.name}')`)))
}

populate()
