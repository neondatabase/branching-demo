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
  const [columns, setColumns] = useState<string[]>([])
  const [resultRows, setResultRows] = useState([])
  const [resultColumns, setResultColumns] = useState<string[]>([])
  const [queryInput, setQueryInput] = useState('')
  const branchName = searchParams.get('branchName') || 'main'
  const fetchData = () => {
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.rows.length > 0) {
          setRows(res.rows)
          setColumns(Object.keys(res.rows[0]))
          toast({
            duration: 1000,
            description: `Data from ${branchName} loaded.`,
          })
        } else {
          setRows([])
          setColumns([])
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
      <div className="flex flex-row items-center justify-between p-10">
        <div className="flex flex-row">
          <span>example/</span>
          <span className="font-bold">{branchName}</span>
        </div>
        <Button
          variant="secondary"
          className="max-w-max"
          disabled={branchName !== 'main'}
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
          <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="mr-2">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
          </svg>
          <span>Fork</span>
        </Button>
      </div>
      <div className="flex flex-row">
        {rows.length > 0 && (
          <div className="w-screen max-w-6xl px-10">
            <span className="font-semibold">playing_with_neon</span>
            <Table className="mt-3 border-t">
              <TableHeader>
                <TableRow>
                  {columns.map((i) => (
                    <TableHead className="font-bold" key={i}>
                      {i}
                    </TableHead>
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
          </div>
        )}
        <div className="flex grow flex-col pr-10">
          <Textarea
            placeholder="SELECT * FROM playing_with_neon;"
            onChange={(e) => {
              setQueryInput(e.target.value)
            }}
          />
          <Button
            variant="secondary"
            className="mt-3 max-w-max"
            onClick={() => {
              setResultRows([])
              setResultColumns([])
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branchName, query: queryInput }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.rows.length > 0) {
                    setResultRows(res.rows)
                    setResultColumns(Object.keys(res.rows[0]))
                  } else {
                    setResultRows([])
                    setResultColumns([])
                  }
                })
                .finally(fetchData)
            }}
          >
            Run &rarr;
          </Button>
          {resultRows.length > 0 && (
            <Table className="mt-3 border-t">
              <TableHeader>
                <TableRow>
                  {resultColumns.map((i) => (
                    <TableHead className="font-bold" key={i}>
                      {i}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultRows.map((i, idx) => (
                  <TableRow key={idx}>
                    {Object.values(i).map((j: any, idx2) => (
                      <TableCell key={idx2}>{j}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
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
