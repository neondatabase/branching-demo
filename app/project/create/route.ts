export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon } from '@neondatabase/serverless'
import { Client } from '@upstash/qstash'
import { NextResponse } from 'next/server'

let client: Client | null = null

if (process.env.QSTASH_TOKEN) client = new Client({ token: process.env.QSTASH_TOKEN })

export async function POST() {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  const body = JSON.stringify({
    endpoints: [
      {
        type: 'read_write',
      },
    ],
    branch: {
      parent_id: process.env.NEON_PARENT_ID,
      name: 'demos-branching-' + new Date().getTime().toString(),
    },
  })
  const start_time = performance.now()
  const newCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`, {
    method: 'POST',
    headers,
    body,
  })
  const newResp = await newCall.json()
  const end_time = performance.now()
  const { connection_uris, branch } = newResp
  const { id: new_branch_id } = branch
  const { connection_uri: new_branch_connection_string } = connection_uris[0]
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    // await sql`CREATE TABLE IF NOT EXISTS branches (branch_name TEXT PRIMARY KEY, connection_string TEXT)`
    await Promise.all(
      [
        sql`INSERT INTO branches (branch_name, connection_string) VALUES (${new_branch_id}, ${new_branch_connection_string})`,
        client &&
          client.publishJSON({
            url: 'https://neon-demos-branching.vercel.app/project/clean',
            body: { new_branch_id },
            delay: 10,
          }),
      ].filter(Boolean),
    )
    return NextResponse.json({
      time: end_time - start_time,
      new_branch_id,
      code: 1,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}
