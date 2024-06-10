'use client'

import { generateUsername } from "unique-username-generator";
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function DataTable({ rows, columns }) {
  return (
    <Table className="mt-3 border-t">
      {columns && (
        <TableHeader>
          <TableRow>
            {columns.map((i) => (
              <TableHead className="font-bold" key={i}>
                {i}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      {rows && (
        <TableBody>
          {rows.map((i, idx) => (
            <TableRow key={idx}>
              {Object.values(i).map((j: any, idx2) => (
                <TableCell key={idx2}>{j}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  )
}

function Page() {
  const { toast } = useToast()
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchName, setNewBranchName] = useState('')
  const [sourceConnectionString, setSourceConnectionString] = useState('')
  const [destinationConnectionString, setDestinationConnectionString] = useState('')
  const searchParams = useSearchParams()
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState<string[]>([])
  const [rows_2, setRows2] = useState([])
  const [columns_2, setColumns2] = useState<string[]>([])
  const branchName = searchParams.get('branchName') || 'main'
  const fetchData = (branchName: string) => {
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.rows.length > 0) {
          if (branchName === 'main') {
            setSourceConnectionString(res.sanitizedConnectionString)
            setRows(res.rows)
            setColumns(Object.keys(res.rows[0]))
          } else {
            setDestinationConnectionString(res.sanitizedConnectionString)
            setRows2(res.rows)
            setColumns2(Object.keys(res.rows[0]))
          }
          toast({
            duration: 1000,
            description: `Data from ${branchName} loaded.`,
          })
        } else {
          if (branchName === 'main') {
            setRows([])
            setColumns([])
          } else {
            setRows2([])
            setColumns2([])
          }
        }
      })
  }
  useEffect(() => {
    toast({
      duration: 1000,
      description: `Loading data from ${branchName} branch...`,
    })
    fetchData('main')
  }, [branchName, searchParams])
  return (
    <>
      <div className="flex flex-col px-10 pt-10">
        <h1 className="tracking-extra-tight text-balance text-[32px] font-semibold leading-[0.9] text-white lg:text-[44px] xl:text-[56px]">Postgres in under a second</h1>
        <h2 className="tracking-extra-tight mt-[18px] text-balance text-xl font-light text-[#AFB1B6] md:mt-2 lg:mt-3 lg:text-base xl:mt-4 xl:text-lg">
          Instantly provison a Postgres database on{' '}
          <a className="text-white underline underline-offset-4 hover:no-underline" href="https://console.neon.tech/signup?ref=instant-postgres">
            Neon
          </a>
        </h2>
      </div>
      <div className="flex flex-row items-center justify-between p-10">
        <span></span>
        <Button
          variant="secondary"
          className="max-w-max"
          disabled={newBranchName.length > 0}
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
                  description: `Creating a copy of ${branchName} branch...`,
                })
                setNewBranchName(res.new_branch_id)
                setNewBranchTime(res.time)
                fetchData(res.new_branch_id)
              })
          }}
        >
          <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="mr-2">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
          </svg>
          <span>Create new branch</span>
        </Button>
      </div>
      <div className="flex flex-row">
        {rows.length > 0 && (
          <div className="flex w-1/2 flex-col px-10">
            <div className="flex flex-row">
              <span>example/</span>
              <span className="font-bold">{branchName}</span>
            </div>
            <span className="mt-3 font-semibold">playing_with_neon</span>
            <span className="font-lighter mt-3 text-sm">{sourceConnectionString}</span>
            <DataTable rows={rows} columns={columns} />
          </div>
        )}
        {rows_2.length > 0 && (
          <div className="flex w-1/2 flex-col px-10">
            <div className="flex flex-row">
              <span>example/</span>
              <span className="font-bold">{newBranchName}</span>
            </div>
            <span className="mt-3 font-semibold">
              playing_with_neon <span className="font-light text-slate-600">(created in {Math.round(newBranchTime * 100) / 100} ms)</span>
            </span>
            <span className="font-lighter mt-3 text-sm">{destinationConnectionString}</span>
            <div className="mt-3 flex flex-row flex-wrap gap-2">
              <Button
                variant="secondary"
                className="max-w-max"
                onClick={() => {
                  fetch('/project/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      branchName: newBranchName,
                      query: `WITH numbered_rows AS ( SELECT ctid, ROW_NUMBER() OVER (ORDER BY (SELECT 1)) as row_num FROM playing_with_neon ) DELETE FROM playing_with_neon WHERE ctid = ( SELECT ctid FROM numbered_rows WHERE row_num = 1 );`,
                    }),
                  }).then(() => {
                    fetchData(newBranchName)
                  })
                }}
              >
                Drop A Row
              </Button>
              <Button
                variant="secondary"
                className="max-w-max"
                onClick={() => {
                  fetch('/project/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      branchName: newBranchName,
                      query: `INSERT INTO playing_with_neon (id, name, value) VALUES (${getRandomInt(10, 100)}, '${generateUsername()}', ${new Date().getTime()})`,
                    }),
                  }).then(() => {
                    fetchData(newBranchName)
                  })
                }}
              >
                Insert A Row
              </Button>
              <Button
                variant="secondary"
                className="max-w-max"
                onClick={() => {
                  fetch('/project/reset?branchName=' + newBranchName).then(() => {
                    fetchData(newBranchName)
                  })
                }}
              >
                Reset
              </Button>
            </div>
            <DataTable rows={rows_2} columns={columns_2} />
          </div>
        )}
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
