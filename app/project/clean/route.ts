export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs'
import { NextResponse } from 'next/server'

async function handler(request: Request) {
  const data = await request.json()
  if (data?.new_branch_id) {
    try {
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Content-Type', 'application/json')
      headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
      await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${data.new_branch_id}`, {
        method: 'DELETE',
        headers,
      })
      return NextResponse.json({ message: `Deleted branch ${data.new_branch_id} succesfully.` }, { status: 200 })
    } catch (e) {
      // @ts-ignore
      console.log(e.message || e.toString())
      return NextResponse.json({ message: `Failed to delete branch ${data.new_branch_id}.` }, { status: 500 })
    }
  }
  return new NextResponse(null, { status: 400 })
}

export const POST = verifySignatureAppRouter(handler)
