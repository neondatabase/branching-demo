export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { type NextRequest, NextResponse } from 'next/server'
import { neon, neonConfig } from '@neondatabase/serverless'

neonConfig.poolQueryViaFetch = true

function neonHeaders() {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  return headers
}

type BranchRow = { id: string; primary?: boolean; default?: boolean; created_at?: string }

function listNonPrimaryBranchesOldestFirst(listJson: unknown): BranchRow[] {
  const raw = Array.isArray(listJson) ? listJson : (listJson as { branches?: BranchRow[] })?.branches
  const branches: BranchRow[] = Array.isArray(raw) ? raw : []
  return branches
    .filter((b) => !b.primary && !b.default)
    .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
}

async function deleteBranch(branchId: string): Promise<boolean> {
  const delRes = await fetch(
    `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${branchId}`,
    { method: 'DELETE', headers: neonHeaders() }
  )
  return delRes.ok
}

export async function POST(request: NextRequest) {
  try {
    return await doCreate(request)
  } catch (e) {
    console.error('[create]', e)
    return NextResponse.json({ code: 0, error: (e as Error)?.message ?? 'Create failed' }, { status: 500 })
  }
}

async function doCreate(request: NextRequest) {
  const headers = neonHeaders()
  const body = JSON.stringify({
    endpoints: [
      {
        type: 'read_write',
        autoscaling_limit_min_cu: 1,
        autoscaling_limit_max_cu: 1,
        suspend_timeout_seconds: -1,
      },
    ],
    branch: {
      parent_id: process.env.NEON_PARENT_ID,
      name: 'demos-branching-' + new Date().getTime().toString(),
    },
  })
  const start_time = performance.now()

  let newCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`, {
    method: 'POST',
    headers,
    body,
  })
  let newResp = await newCall.json() as { branch?: { id: string }; connection_uris?: Array<{ connection_uri: string }>; code?: string; message?: string }

  if (newCall.status === 422 && newResp?.code === 'BRANCHES_LIMIT_EXCEEDED') {
    // First run full stale cleanup (branches older than 1h), then retry create
    try {
      const origin = new URL(request.url).origin
      await fetch(`${origin}/project/cleanup-stale`, { method: 'POST' })
    } catch (_) {}
    // Retry create after cleanup; if still at limit, delete single oldest and retry
    newCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`, {
      method: 'POST',
      headers,
      body,
    })
    newResp = await newCall.json() as typeof newResp

    if (newCall.status === 422 && newResp?.code === 'BRANCHES_LIMIT_EXCEEDED') {
      const listRes = await fetch(
        `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`,
        { headers: neonHeaders() }
      )
      if (listRes.ok) {
        const listJson = await listRes.json()
        const toDelete = listNonPrimaryBranchesOldestFirst(listJson)[0]
        if (toDelete?.id && (await deleteBranch(toDelete.id))) {
          try {
            const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
            await sql`DELETE FROM branches WHERE branch_name = ${toDelete.id}`
          } catch (_) {}
          newCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`, {
            method: 'POST',
            headers,
            body,
          })
          newResp = await newCall.json() as typeof newResp
        }
      }
    }
  }

  const end_time = performance.now()

  if (!newCall.ok) {
    const message = newResp?.message ?? newResp?.code ?? newCall.statusText
    return NextResponse.json({ code: 0, error: message }, { status: 502 })
  }

  const branch = newResp?.branch
  const connection_uris = newResp?.connection_uris
  if (!branch?.id || !connection_uris?.[0]?.connection_uri) {
    return NextResponse.json({ code: 0, error: 'Unexpected response from Neon API' }, { status: 502 })
  }

  const new_branch_id = branch.id
  const new_branch_connection_string = connection_uris[0].connection_uri
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    await sql`INSERT INTO branches (branch_name, connection_string) VALUES (${new_branch_id}, ${new_branch_connection_string})`
    return NextResponse.json({
      time: end_time - start_time,
      new_branch_id,
      code: 1,
    })
  } catch (e) {
    console.error('[create] insert branches', e)
    return NextResponse.json({ code: 0, error: (e as Error)?.message ?? 'Database error' }, { status: 500 })
  }
}
