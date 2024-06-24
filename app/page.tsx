'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { CircleMinus, CirclePlus, TimerReset } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { generateUsername } from 'unique-username-generator'

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function DataTable({ rows, columns }: { rows: any[]; columns: any[] }) {
  return (
    <Table className="mt-8 border-t">
      {columns && (
        <TableHeader>
          <TableRow>
            {columns.map((i) => (
              <TableHead key={i}>{i}</TableHead>
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
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [dropBranchTime, setDropBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
  const [newBranchName, setNewBranchName] = useState('')
  const [sourceConnectionString, setSourceConnectionString] = useState('')
  const [destinationConnectionString, setDestinationConnectionString] = useState('')
  const searchParams = useSearchParams()
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState<string[]>([])
  const [rows_2, setRows2] = useState([])
  const [columns_2, setColumns2] = useState<string[]>([])
  const [rows_3, setRows3] = useState([])
  const [columns_3, setColumns3] = useState<string[]>([])
  const [rows_4, setRows4] = useState([])
  const [columns_4, setColumns4] = useState<string[]>([])
  const [rows_5, setRows5] = useState([])
  const [columns_5, setColumns5] = useState<string[]>([])
  const branchName = searchParams.get('branchName') || 'main'
  const fetchData = (branchName: string) =>
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.rows.length > 0) {
          if (branchName === 'main') {
            setSourceConnectionString(res.sanitizedConnectionString)
            setRows(res.rows)
            setColumns(Object.keys(res.rows[0]))
          } else {
            if (rows_2.length < 1) {
              setDestinationConnectionString(res.sanitizedConnectionString)
              setRows2(res.rows)
              setColumns2(Object.keys(res.rows[0]))
            } else if (rows_3.length < 1) {
              setDestinationConnectionString(res.sanitizedConnectionString)
              setRows3(res.rows)
              setColumns3(Object.keys(res.rows[0]))
            } else if (rows_4.length < 1) {
              setDestinationConnectionString(res.sanitizedConnectionString)
              setRows4(res.rows)
              setColumns4(Object.keys(res.rows[0]))
            } else if (rows_5.length < 1) {
              setDestinationConnectionString(res.sanitizedConnectionString)
              setRows5(res.rows)
              setColumns5(Object.keys(res.rows[0]))
            }
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
  useEffect(() => {
    toast({
      duration: 1000,
      description: `Loading data from ${branchName} branch...`,
    })
    fetchData('main')
  }, [branchName, searchParams])
  return (
    <div className="mx-auto mb-24 max-w-screen-lg">
      <div className="flex flex-col">
        <h1 className="tracking-extra-tight text-balance text-[32px] font-semibold leading-[0.9] text-white lg:text-[44px] xl:text-[56px]">Database branches in milliseconds</h1>
        <h2 className="tracking-extra-tight mt-[18px] text-balance text-xl font-light text-[#AFB1B6] md:mt-2 lg:mt-3 lg:text-base xl:mt-4 xl:text-lg">
          Instantly provison isolated branches of a Postgres database on&nbsp;
          <a className="text-white underline underline-offset-4 hover:no-underline" href="https://console.neon.tech/signup">
            Neon
          </a>
          .
        </h2>
      </div>
      <div className="flex flex-row items-center py-10">
        <span></span>
        <Button
          variant="outline"
          className="max-w-max bg-transparent"
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
                fetchData(res.new_branch_id).then(() => {
                  setTimeout(() => {
                    document.getElementById('provisioned')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }, 200)
                })
              })
          }}
        >
          <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="mr-2 fill-white">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
          </svg>
          <span>Create new branch</span>
        </Button>
      </div>
      <div className="flex w-full flex-row flex-wrap">
        {rows.length > 0 && (
          <div className="flex w-full flex-col">
            <div className="flex flex-row">
              <span>Branch:&nbsp;</span>
              <span className="font-bold">{branchName}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Connection String:&nbsp;</span>
              <span className="font-bold">{sourceConnectionString}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Table:&nbsp;</span>
              <span className="font-bold">playing_with_neon</span>
            </div>
            <DataTable rows={rows} columns={columns} />
          </div>
        )}
        {rows_2.length > 0 && (
          <div id="provisioned" className="mt-24 flex w-full flex-col">
            <div className="flex flex-row">
              <span>Branch:&nbsp;</span>
              <span className="font-bold">{newBranchName}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Connection String:&nbsp;</span>
              <span className="font-bold">{destinationConnectionString}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Table:&nbsp;</span>
              <span className="font-bold">playing_with_neon {newBranchTime && <span className="font-light">(created in {Math.round(newBranchTime * 100) / 100} ms)</span>}</span>
            </div>
            <div className="mt-3 flex flex-row flex-wrap gap-2">
              <Button
                variant="outline"
                className="max-w-max bg-transparent"
                onClick={() => {
                  fetch('/project/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      branchName: newBranchName,
                      query: `WITH numbered_rows AS ( SELECT ctid, ROW_NUMBER() OVER (ORDER BY (SELECT 1)) as row_num FROM playing_with_neon ) DELETE FROM playing_with_neon WHERE ctid = ( SELECT ctid FROM numbered_rows WHERE row_num = 1 );`,
                    }),
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.time) setDropBranchTime(res.time)
                      fetchData(newBranchName).then(() => {
                        setTimeout(() => {
                          document.getElementById('insert-row')?.scrollIntoView({
                            behavior: 'smooth',
                          })
                        }, 200)
                      })
                    })
                }}
              >
                <CircleMinus size="18" />
                <span className="ml-3">Drop A Row</span>
              </Button>
            </div>
            <DataTable rows={rows_2} columns={columns_2} />
          </div>
        )}
        {rows_3.length > 0 && (
          <div id="insert-row" className="mt-24 flex w-full flex-col">
            <div className="flex flex-row">
              <span>Branch:&nbsp;</span>
              <span className="font-bold">{newBranchName}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Connection String:&nbsp;</span>
              <span className="font-bold">{destinationConnectionString}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Table:&nbsp;</span>
              <span className="font-bold">
                playing_with_neon {dropBranchTime && <span className="font-light">(dropped a row in {Math.round(dropBranchTime * 100) / 100} ms)</span>}
              </span>
            </div>
            <div className="mt-3 flex flex-row flex-wrap gap-2">
              <Button
                variant="outline"
                className="max-w-max bg-transparent"
                onClick={() => {
                  fetch('/project/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      branchName: newBranchName,
                      query: `INSERT INTO playing_with_neon (id, name, value) VALUES (${getRandomInt(10, 100)}, '${generateUsername()}', ${new Date().getTime()})`,
                    }),
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.time) setInsertBranchTime(res.time)
                      fetchData(newBranchName).then(() => {
                        setTimeout(() => {
                          document.getElementById('reset-row')?.scrollIntoView({
                            behavior: 'smooth',
                          })
                        }, 200)
                      })
                    })
                }}
              >
                <CirclePlus size="18" />
                <span className="ml-3">Insert A Row</span>
              </Button>
            </div>
            <DataTable rows={rows_3} columns={columns_3} />
          </div>
        )}
        {rows_4.length > 0 && (
          <div id="reset-row" className="mt-24 flex w-full flex-col">
            <div className="flex flex-row">
              <span>Branch:&nbsp;</span>
              <span className="font-bold">{newBranchName}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Connection String:&nbsp;</span>
              <span className="font-bold">{destinationConnectionString}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Table:&nbsp;</span>
              <span className="font-bold">
                playing_with_neon {insertBranchTime && <span className="font-light">(inserted a row in {Math.round(insertBranchTime * 100) / 100} ms)</span>}
              </span>
            </div>
            <div className="mt-3 flex flex-row flex-wrap gap-2">
              <Button
                variant="outline"
                className="max-w-max bg-transparent"
                onClick={() => {
                  fetch('/project/reset?branchName=' + newBranchName)
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.time) setResetBranchTime(res.time)
                      fetchData(newBranchName).then(() => {
                        setTimeout(() => {
                          document.getElementById('resetted-branch')?.scrollIntoView({
                            behavior: 'smooth',
                          })
                        }, 200)
                      })
                    })
                }}
              >
                <TimerReset size="18" />
                <span className="ml-3">Reset</span>
              </Button>
            </div>
            <DataTable rows={rows_4} columns={columns_4} />
          </div>
        )}
        {rows_5.length > 0 && (
          <div id="resetted-branch" className="mt-24 flex w-full flex-col">
            <div className="flex flex-row">
              <span>Branch:&nbsp;</span>
              <span className="font-bold">{newBranchName}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Connection String:&nbsp;</span>
              <span className="font-bold">{destinationConnectionString}</span>
            </div>
            <div className="mt-2 flex flex-row">
              <span>Table:&nbsp;</span>
              <span className="font-bold">
                playing_with_neon {resetBranchTime && <span className="font-light">(reset branch in {Math.round(resetBranchTime * 100) / 100} ms)</span>}
              </span>
            </div>
            <DataTable rows={rows_5} columns={columns_5} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
