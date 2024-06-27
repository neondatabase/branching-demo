'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { CircleMinus, CirclePlus, TimerReset } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { generateUsername } from 'unique-username-generator'

function DataTable({ rows, columns, highlight = 0 }: { rows: any[]; columns: any[]; highlight?: number }) {
  return (
    <>
      <div className="mt-8 flex flex-row">
        <span>Table:&nbsp;</span>
        <span>playing_with_neon</span>
      </div>
      <Table className="mt-2 border-t">
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
              <TableRow className={highlight - 1 === idx ? 'bg-green-800 text-white' : ''} key={idx}>
                {Object.values(i).map((j: any, idx2) => (
                  <TableCell key={idx2}>{j}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  )
}

function Page() {
  const driverObj = driver()
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchSize, setNewBranchSize] = useState(0)
  const [newBranchName, setNewBranchName] = useState('')
  const [dropBranchTime, setDropBranchTime] = useState(0)
  const [mainBranchSize, setMainBranchSize] = useState(0)
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
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
  const fetchBranchSize = (branchName: string) =>
    fetch(`/project/size?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        const { logical_size } = res
        if (branchName === 'main') setMainBranchSize(logical_size)
        else setNewBranchSize(logical_size === 'NaN' ? mainBranchSize : logical_size)
      })
  const fetchData = (branchName: string) =>
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => {
        fetchBranchSize(branchName)
        return res.json()
      })
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
              setTimeout(() => {
                setIsVisible(true)
                setTimeout(() => {
                  setIsVisible(false)
                }, 3000)
              }, 1000)
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
  useEffect(() => {
    setTimeout(() => {
      driverObj.highlight({
        element: '#createBranchButton',
        popover: {
          title: 'Get started!',
          description: 'Click here to create a copy of a Postgres database.',
        },
      })
    }, 1000)
  }, [])
  return (
    <>
      {isVisible && (
        <div className="fixed left-0 top-0 h-screen w-screen">
          <Confetti />
        </div>
      )}
      <div className="mx-auto mb-24 max-w-screen-lg">
        <div className="flex flex-col">
          <h1 className="tracking-extra-tight text-balance text-[32px] font-semibold leading-[0.9] text-white lg:text-[44px] xl:text-[56px]">Copy database in milliseconds</h1>
          <h2 className="tracking-extra-tight mt-[18px] text-balance text-xl font-light text-[#AFB1B6] md:mt-2 lg:mt-3 lg:text-base xl:mt-4 xl:text-lg">
            Instantly provison a copy of your Postgres database on&nbsp;
            <a className="text-white underline underline-offset-4 hover:no-underline" href="https://console.neon.tech/signup">
              Neon
            </a>
            .
          </h2>
        </div>
        <div className="flex flex-row items-center py-10">
          <span></span>
          <Button
            id="createBranchButton"
            className="max-w-max bg-white shadow hover:scale-105 hover:bg-[#00e5bf]"
            disabled={newBranchName.length > 0}
            onClick={() => {
              toast({
                duration: 2000,
                description: `Creating a copy of data in ${branchName} branch...`,
              })
              driverObj.destroy()
              fetch('/project/create', { method: 'POST' })
                .then((res) => res.json())
                .then((res) => {
                  toast({
                    duration: 1000,
                    description: `Creating a copy of ${branchName} branch...`,
                  })
                  setNewBranchName(res.new_branch_id)
                  if (res.time) setNewBranchTime(res.time)
                  fetchData(res.new_branch_id).then(() => {
                    setTimeout(() => {
                      document.getElementById('provisioned')?.scrollIntoView({
                        behavior: 'smooth',
                      })
                      setTimeout(() => {
                        driverObj.highlight({
                          element: '#dropRowButton',
                          popover: {
                            title: 'Time to make changes!',
                            description: 'Now that you have copied your database, you can confidently make changes. Click here to drop a row.',
                          },
                        })
                      }, 1000)
                    }, 200)
                  })
                })
            }}
          >
            <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="mr-2 fill-black">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg>
            <span>Create a copy</span>
          </Button>
        </div>
        <div className="flex w-full flex-row flex-wrap">
          {rows.length > 0 && (
            <div className="flex w-full flex-col">
              <div className="flex flex-row">
                <span>Branch Name:&nbsp;</span>
                <span className="font-bold">{branchName}</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Branch Size:&nbsp;</span>
                <span className="font-bold">{mainBranchSize} GiB</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Connection String:&nbsp;</span>
                <span className="font-bold">{sourceConnectionString}</span>
              </div>
              <DataTable rows={rows} columns={columns} />
            </div>
          )}
          {rows_2.length > 0 && (
            <div id="provisioned" className="flex w-full flex-col pt-24">
              <div className="flex flex-row">
                <span>Branch Name:&nbsp;</span>
                <span className="font-bold">{newBranchName}</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Branch Size:&nbsp;</span>
                <span className="font-bold">{newBranchSize} GiB</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Connection String:&nbsp;</span>
                <span className="font-bold">{destinationConnectionString}</span>
              </div>
              {newBranchTime > 0 && (
                <div className="mt-2 flex flex-row">
                  <span>
                    Created a new branch in <span className="font-bold text-[#00e5bf]">{Math.round(newBranchTime * 100) / 100} ms</span>
                  </span>
                </div>
              )}
              <div className="mt-3 flex flex-row flex-wrap gap-2">
                <Button
                  id="dropRowButton"
                  disabled={rows_3.length > 0}
                  className="max-w-max bg-white shadow hover:scale-105 hover:bg-[#00e5bf]"
                  onClick={() => {
                    driverObj.destroy()
                    fetch('/project/query', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        branchName: newBranchName,
                        query: `WITH numbered_rows AS ( SELECT ctid, ROW_NUMBER() OVER (ORDER BY (SELECT 1)) as row_num FROM playing_with_neon ) DELETE FROM playing_with_neon WHERE ctid = ( SELECT ctid FROM numbered_rows WHERE row_num = 1000)`,
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
                            setTimeout(() => {
                              driverObj.highlight({
                                element: '#insertRowButton',
                                popover: {
                                  title: 'Time to make more changes!',
                                  description: "Let's make more changes. Click here to insert a row.",
                                },
                              })
                            }, 1000)
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
            <div id="insert-row" className="flex w-full flex-col pt-24">
              <div className="flex flex-row">
                <span>Branch Name:&nbsp;</span>
                <span className="font-bold">{newBranchName}</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Branch Size:&nbsp;</span>
                <span className="font-bold">{newBranchSize} GiB</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Connection String:&nbsp;</span>
                <span className="font-bold">{destinationConnectionString}</span>
              </div>
              {dropBranchTime > 0 && (
                <div className="mt-2 flex flex-row">
                  <span>
                    Dropped the row with <span className="font-bold text-red-400">id 999</span> in{' '}
                    <span className="font-bold text-[#00e5bf]">{Math.round(dropBranchTime * 100) / 100} ms</span>
                  </span>
                </div>
              )}
              <div className="mt-3 flex flex-row flex-wrap gap-2">
                <Button
                  id="insertRowButton"
                  disabled={rows_4.length > 0}
                  className="max-w-max bg-white shadow hover:scale-105 hover:bg-[#00e5bf]"
                  onClick={() => {
                    driverObj.destroy()
                    fetch('/project/query', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        branchName: newBranchName,
                        query: `INSERT INTO playing_with_neon (id, name) VALUES (999, '${generateUsername()}')`,
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
                            setTimeout(() => {
                              driverObj.highlight({
                                element: '#resetRowButton',
                                popover: {
                                  title: 'Stash the changes!',
                                  description: 'Oops, we modified the data. What if you wanted to the same data again?',
                                },
                              })
                            }, 1000)
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
            <div id="reset-row" className="flex w-full flex-col pt-24">
              <div className="flex flex-row">
                <span>Branch Name:&nbsp;</span>
                <span className="font-bold">{newBranchName}</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Branch Size:&nbsp;</span>
                <span className="font-bold">{newBranchSize} GiB</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Connection String:&nbsp;</span>
                <span className="font-bold">{destinationConnectionString}</span>
              </div>
              {insertBranchTime > 0 && (
                <div className="mt-2 flex flex-row">
                  <span>
                    Inserted a row in <span className="font-bold text-[#00e5bf]">{Math.round(insertBranchTime * 100) / 100} ms</span>
                  </span>
                </div>
              )}
              <div className="mt-3 flex flex-row flex-wrap gap-2">
                <Button
                  id="resetRowButton"
                  disabled={rows_5.length > 0}
                  className="max-w-max bg-white shadow hover:scale-105 hover:bg-[#00e5bf]"
                  onClick={() => {
                    driverObj.destroy()
                    fetch('/project/reset?branchName=' + newBranchName)
                      .then((res) => res.json())
                      .then((res) => {
                        if (res.time) setResetBranchTime(res.time)
                        toast({
                          description: 'Requesting branch reset...',
                        })
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
                  <span className="ml-3">Reset the branch</span>
                </Button>
              </div>
              <DataTable highlight={1} rows={rows_4} columns={columns_4} />
            </div>
          )}
          {rows_5.length > 0 && (
            <div id="resetted-branch" className="flex w-full flex-col pt-24">
              <div className="flex flex-row">
                <span>Branch Name:&nbsp;</span>
                <span className="font-bold">{newBranchName}</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Branch Size:&nbsp;</span>
                <span className="font-bold">{newBranchSize} GiB</span>
              </div>
              <div className="mt-2 flex flex-row">
                <span>Connection String:&nbsp;</span>
                <span className="font-bold">{destinationConnectionString}</span>
              </div>
              {resetBranchTime > 0 && (
                <div className="mt-2 flex flex-row">
                  <span>
                    Branch reset in <span className="font-bold text-[#00e5bf]">{Math.round(resetBranchTime * 100) / 100} ms</span>
                  </span>
                </div>
              )}
              <DataTable rows={rows_5} columns={columns_5} />
            </div>
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
