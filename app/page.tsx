'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useSearchParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const branchName = searchParams.get('branchName') || 'main'
  useEffect(() => {
    toast({
      duration: 1000,
      description: `Loading data from ${branchName} branch...`,
    })
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.rows) {
          setRows(res.rows)
          // @ts-ignore
          setColumns(Object.keys(res.rows[0]))
          toast({
            duration: 1000,
            description: `Data from ${branchName} loaded.`,
          })
        }
      })
  }, [branchName, searchParams])
  return (
    <>
      {branchName === 'main' && (
        <Button
          onClick={() => {
            toast({
              duration: 2000,
              description: `Creating a copy of data in ${branchName} branch...`
            })
            fetch('/project/create', { method: 'POST' })
              .then((res) => res.json())
              .then((res) => {
                toast({
                  duration: 1000,
                  description: `Loading your copy of ${branchName} branch...`
                })
                router.push(`/?branchName=${res.new_branch_id}`)
              })
          }}
        >
          Clone &rarr;
        </Button>
      )}
      {rows.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((i) => (
                <TableHead key={i}>{i}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i, idx) => (
              <TableRow key={idx}>
                {Object.values(i).map((j: any, idx2) => (
                  <TableCell key={idx2}>{j}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
