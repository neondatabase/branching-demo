export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon, neonConfig } from '@neondatabase/serverless'
import { type NextRequest, NextResponse } from 'next/server'

neonConfig.poolQueryViaFetch = true

const maskConnectionString = (connectionString: string) => {
  const urlPattern = /^(.*:\/\/)(.*:.*@)?(.*)$/
  const matches = connectionString.match(urlPattern)
  if (!matches) return 'Invalid connection string'
  const protocol = matches[1]
  const authPart = matches[2] ? '***:***@' : ''
  const restOfString = matches[3]
  return `${protocol}${authPart}${restOfString}`
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const branchName = searchParams.get('branchName')
  if (!branchName) {
    return NextResponse.json({ code: 0, error: 'branchName is required' }, { status: 400 })
  }
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    if (branchName === 'main') {
      const rows = await sql`SELECT * FROM playing_with_neon ORDER BY id DESC LIMIT 5`
      return NextResponse.json({
        sanitizedConnectionString: maskConnectionString(`${process.env.DB_CONNECTION_STRING}`),
        rows,
        code: 1,
      })
    }
    const parent_rows = await sql`SELECT * FROM branches WHERE branch_name = ${branchName} LIMIT 1`
    const row = parent_rows[0]
    if (!row?.connection_string) {
      return NextResponse.json({ code: 0, error: 'Branch not found', rows: [] }, { status: 404 })
    }
    const connectionString = row.connection_string
    const sql_1 = neon(connectionString)
    const rows = await sql_1`SELECT * FROM playing_with_neon ORDER BY id DESC LIMIT 5`
    return NextResponse.json({
      sanitizedConnectionString: maskConnectionString(connectionString),
      rows,
      code: 1,
    })
  } catch (e) {
    console.error('[data]', e)
    return NextResponse.json({ code: 0 })
  }
}
