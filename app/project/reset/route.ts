export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const branchName = searchParams.get('branchName')
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  const body = JSON.stringify({ source_branch_id: process.env.NEON_PARENT_ID })
  await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${branchName}/restore`, {
    method: 'POST',
    headers,
    body,
  })
  return NextResponse.json({
    code: 1,
  })
}
