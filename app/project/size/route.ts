export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const branchName = searchParams.get('branchName')
  try {
    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
    const branch_id = branchName === 'main' ? process.env.NEON_PARENT_ID : branchName
    const respCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${branch_id}`, {
      headers,
    })
    const tmp = await respCall.json()
    const { logical_size } = tmp.branch
    console.log(logical_size, branchName)
    return NextResponse.json({ logical_size: (logical_size / (1024 * 1024 * 1024)).toFixed(2) })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}
