export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'
import { neon, neonConfig } from '@neondatabase/serverless'

neonConfig.poolQueryViaFetch = true

const ONE_HOUR_MS = 60 * 60 * 1000

function neonHeaders() {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  return headers
}

type BranchRow = { id: string; primary?: boolean; default?: boolean; created_at?: string }

/** Neon list branches returns { branches: BranchRow[] }. */
function getBranchesList(listJson: unknown): BranchRow[] {
  if (Array.isArray(listJson)) return listJson as BranchRow[]
  const obj = listJson as { branches?: unknown }
  const raw = obj?.branches
  return Array.isArray(raw) ? (raw as BranchRow[]) : []
}

/** Non-primary branches that are older than 1 hour, oldest first. */
function staleBranchesToDelete(branches: BranchRow[]): BranchRow[] {
  const cutoff = Date.now() - ONE_HOUR_MS
  return branches
    .filter((b) => !b.primary && !b.default)
    .filter((b) => {
      if (!b.created_at) return false
      const created = new Date(b.created_at).getTime()
      return !Number.isNaN(created) && created < cutoff
    })
    .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
}

async function deleteBranchFromNeon(branchId: string): Promise<boolean> {
  const res = await fetch(
    `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${branchId}`,
    { method: 'DELETE', headers: neonHeaders() }
  )
  return res.ok
}

/**
 * POST /project/cleanup-stale
 * Deletes non-primary branches older than 1 hour (Neon + local branches table).
 * Called after the user completes "Restore the database" so we don't run during create.
 */
export async function POST() {
  try {
    const listRes = await fetch(
      `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`,
      { headers: neonHeaders() }
    )
    if (!listRes.ok) {
      const text = await listRes.text()
      console.error('[cleanup-stale] list branches failed:', listRes.status, text)
      return NextResponse.json(
        { error: 'Failed to list branches', status: listRes.status },
        { status: 502 }
      )
    }

    let listJson: unknown
    try {
      listJson = await listRes.json()
    } catch (e) {
      console.error('[cleanup-stale] list response not JSON', e)
      return NextResponse.json({ error: 'Invalid response from Neon' }, { status: 502 })
    }

    const allBranches = getBranchesList(listJson)
    const toDelete = staleBranchesToDelete(allBranches)

    if (toDelete.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'No stale branches' })
    }

    const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
    let deleted = 0

    for (const b of toDelete) {
      const ok = await deleteBranchFromNeon(b.id)
      if (ok) {
        deleted += 1
        try {
          await sql`DELETE FROM branches WHERE branch_name = ${b.id}`
        } catch (_) {
          // branch row might not exist
        }
      } else {
        console.warn('[cleanup-stale] failed to delete branch:', b.id)
      }
    }

    return NextResponse.json({ deleted, message: `Deleted ${deleted} stale branch(es)` })
  } catch (e) {
    console.error('[cleanup-stale]', e)
    return NextResponse.json(
      { error: (e as Error)?.message ?? 'Cleanup failed' },
      { status: 500 }
    )
  }
}
