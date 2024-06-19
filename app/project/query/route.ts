export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon } from '@neondatabase/serverless'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { branchName, query } = await request.json()
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    if (branchName === 'main') {
      if (query.includes('SELECT ')) {
        const start_time = performance.now()
        const rows = await sql(query)
        const end_time = performance.now()
        return NextResponse.json({
          time: end_time - start_time,
          rows,
          code: 1,
        })
      }
    }
    const parent_rows = await sql`SELECT * FROM branches WHERE branch_name = ${branchName} LIMIT 1`
    const connectionString = parent_rows[0]['connection_string']
    const sql_1 = neon(connectionString)
    const start_time = performance.now()
    const rows = await sql_1(query)
    const end_time = performance.now()
    return NextResponse.json({
      time: end_time - start_time,
      rows,
      code: 1,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}
