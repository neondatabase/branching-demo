'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [queryInput, setQueryInput] = useState('')
  const branchName = searchParams.get('branchName') || 'main'
  const fetchData = () => {
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
  }
  useEffect(() => {
    toast({
      duration: 1000,
      description: `Loading data from ${branchName} branch...`,
    })
    fetchData()
  }, [branchName, searchParams])
  return (
    <>
      {branchName === 'main' ? (
        <Button
          onClick={() => {
            toast({
              duration: 2000,
              description: `Creating a copy of data in ${branchName} branch...`,
            })
            fetch('/project/create', { method: 'POST' })
              .then((res) => res.json())
              .then((res) => {
                toast({
                  duration: 1000,
                  description: `Loading your copy of ${branchName} branch...`,
                })
                router.push(`/?branchName=${res.new_branch_id}`)
              })
          }}
        >
          Clone &rarr;
        </Button>
      ) : (
        <div className="flex flex-col">
          <Textarea
            onChange={(e) => {
              setQueryInput(e.target.value)
            }}
          />
          <Button
            onClick={() => {
              setRows([])
              setColumns([])
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branchName, query: queryInput }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.rows) {
                    setRows(res.rows)
                    // @ts-ignore
                    setColumns(Object.keys(res.rows[0]))
                  }
                })
            }}
          >
            Run
          </Button>
        </div>
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

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
