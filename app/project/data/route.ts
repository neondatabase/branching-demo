export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon } from '@neondatabase/serverless'
import { type NextRequest, NextResponse } from 'next/server'

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
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    if (branchName === 'main') {
      const rows = await sql`SELECT * FROM playing_with_neon`
      return NextResponse.json({
        sanitizedConnectionString: maskConnectionString(`${process.env.DB_CONNECTION_STRING}`),
        rows,
        code: 1,
      })
    }
    const parent_rows = await sql`SELECT * FROM branches WHERE branch_name = ${branchName} LIMIT 1`
    const connectionString = parent_rows[0]['connection_string']
    const sql_1 = neon(connectionString)
    const rows = await sql_1`SELECT * from playing_with_neon;`
    console.log(connectionString)
    return NextResponse.json({
      sanitizedConnectionString: maskConnectionString(connectionString),
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
