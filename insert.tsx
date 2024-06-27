import 'dotenv/config'
import { parse } from 'csv-parse'
import { createReadStream } from 'fs'
import { slug } from 'github-slugger'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DB_CONNECTION_STRING!)

let counter = 0
const transactions: any[] = []

async function populate() {
  await sql(`DROP TABLE playing_with_neon`)
  await sql(`CREATE TABLE playing_with_neon (id INTEGER PRIMARY KEY, singer TEXT, song TEXT)`)
  createReadStream('./spotify_millsongdata.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', function (row) {
      counter += 1
      transactions.push(sql(`INSERT INTO playing_with_neon (id, singer, song) VALUES (${counter}, '${slug(row[0])}', '${slug(row[1])}')`))
    })
    .on('error', function (error) {
      console.log('[0]')
      console.log(error.message)
    })
    .on('end', async function () {
      console.log('[1]')
      await sql.transaction(transactions)
    })
}

populate()
