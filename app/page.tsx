'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CircleMinus, CirclePlus, TimerReset } from 'lucide-react'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { generateUsername } from 'unique-username-generator'

interface Stage {
  icon: string
  branched: boolean
  next?: boolean
  prev?: boolean
  rightView?: ReactElement
  leftView?: ReactElement
  label?: string
}

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [toBeRemoved, setToBeRemoved] = useState<number[]>([])
  //
  const { toast } = useToast()
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchSize, setNewBranchSize] = useState(0)
  const [newBranchName, setNewBranchName] = useState('')
  const [dropBranchTime, setDropBranchTime] = useState(0)
  const [mainBranchSize, setMainBranchSize] = useState(0)
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
  const [sourceConnectionString, setSourceConnectionString] = useState('')
  const [destinationConnectionString, setDestinationConnectionString] = useState('')
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
  //
  function DataTable({
    rows = [],
    columns = [],
    highlight = 0,
    databaseName = 'main',
    editable = false,
  }: {
    rows: any[]
    columns: any[]
    highlight?: number
    databaseName?: string
    editable?: boolean
  }) {
    return (
      <>
        <span className="text-md text-white/30">
          Database: <span className="text-white/70">{databaseName}</span>, Table: <span className="text-white/70">playing_with_neon</span>
        </span>
        <Table className={cn('mt-3 border-t', rows.length < 1 && 'border-separate border-spacing-y-1')}>
          {columns.length > 0 && (
            <TableHeader>
              <TableRow>
                {editable && <TableHead>&nbsp;</TableHead>}
                {columns.map((i) => (
                  <TableHead key={i}>{i}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          {rows.length > 0 ? (
            <TableBody>
              {rows.map((i, idx) => (
                <TableRow className={highlight - 1 === idx ? 'bg-green-800 text-white' : ''} key={idx}>
                  {editable && (
                    <TableCell>
                      <Input
                        type="checkbox"
                        checked={toBeRemoved.includes(i.id)}
                        onChange={(event) => {
                          if (event.target.checked) setToBeRemoved((copyRemoved) => [...copyRemoved, i.id])
                          else setToBeRemoved((copyRemoved) => [...copyRemoved].filter((oops) => oops != i.id))
                        }}
                      />
                    </TableCell>
                  )}
                  {Object.values(i).map((j: any, idx2) => (
                    <TableCell key={idx2}>{j}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow className="animate-pulse bg-gray-100/10">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="animate-pulse bg-gray-100/10">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="animate-pulse bg-gray-100/10">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="animate-pulse bg-gray-100/10">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="animate-pulse bg-gray-100/10">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </>
    )
  }
  //
  const stages: Stage[] = [
    {
      label: 'Welcome',
      icon: 'https://www.svgrepo.com/show/521608/document.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <h1 className="text-3xl font-semibold text-white">Copy your database in milliseconds</h1>
          <span className="mt-3 font-light text-gray-400">
            In this demo, you will create a copy of your database, make changes to it, and restore it to the original state in milliseconds. Behind the scenes, you are
            leveraging&nbsp;
            <a className="text-white/75 hover:underline hover:underline-offset-4" href="https://console.neon.tech/signup">
              Neon
            </a>
            {"'"}s instant branching.
          </span>
          <Button
            onClick={() => {
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-[#00e599]"
          >
            {"Let's"} begin &rarr;
          </Button>
        </div>
      ),
    },
    {
      label: 'Original database',
      icon: 'https://www.svgrepo.com/show/471315/database-02.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Create your own Postgres database</span>
          <span className="mt-3 text-balance text-gray-400">
            A Neon database is created in{' '}
            <a className="border-b text-white" target="_blank" href="https://neon.tech/demos/instant-postgres">
              under a second
            </a>
            . For now, we have prepared a database for you to copy. Currently, the size of this database is about{' '}
            <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB.
          </span>
          <Button
            onClick={() => {
              toast({
                duration: 4000,
                description: `Creating a copy of data in main database...`,
              })
              fetch('/project/create', { method: 'POST' })
                .then((res) => res.json())
                .then((res) => {
                  toast({
                    duration: 4000,
                    description: `Fetching data in the copied database...`,
                  })
                  setNewBranchName(res.new_branch_id)
                  if (res.time) setNewBranchTime(res.time)
                  fetchData(res.new_branch_id)
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max"
          >
            <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="mr-2 fill-black">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg>
            Create a copy &rarr;
          </Button>
        </div>
      ),
      rightView: <DataTable rows={rows} columns={columns} />,
    },
    {
      label: 'Copied database',
      icon: 'https://www.svgrepo.com/show/445570/branch.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">I want to make changes in the copy</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(newBranchTime > 0 && 'text-green-400')}>{newBranchTime > 0 ? Math.round(newBranchTime * 100) / 100 : '............'}</span> ms, your copy
            of <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB was created. Now, let{"'"}s make a change to make sure that it is
            an isolated copy of your original database.
          </span>
          <Button
            variant="destructive"
            disabled={toBeRemoved.length < 1}
            onClick={() => {
              toast({
                duration: 4000,
                description: 'Dropping a row from the copied database...',
              })
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  branchName: newBranchName,
                  query: `DELETE FROM playing_with_neon WHERE ${toBeRemoved.map((i) => `id = ${i}`).join(' OR ')}`,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) setDropBranchTime(res.time)
                  fetchData(newBranchName)
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max"
          >
            <CircleMinus size="18" />
            <span className="ml-3">Remove selected rows</span>
          </Button>
        </div>
      ),
      rightView: <DataTable editable={true} rows={rows_2} columns={columns_2} databaseName={newBranchName} />,
    },
    {
      label: 'Edited database',
      icon: 'https://www.svgrepo.com/show/449277/subtract.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">I want to make more changes in the copy</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(dropBranchTime > 0 && 'text-green-400')}>{dropBranchTime > 0 ? Math.round(dropBranchTime * 100) / 100 : '............'}</span> ms, you
            dropped a row in your copied database. Now, let{"'"}s make one more change to make sure that your data is quite different from the original database.
          </span>
          <Button
            onClick={() => {
              toast({
                duration: 4000,
                description: 'Adding a row to the copied database...',
              })
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  branchName: newBranchName,
                  query: `INSERT INTO playing_with_neon (id, singer, song) VALUES (${Math.floor(Math.random() * 90000) + 50000}, '${generateUsername()}', 'new-song-name')`,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) setInsertBranchTime(res.time)
                  fetchData(newBranchName)
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-green-400"
          >
            <CirclePlus size="18" />
            <span className="ml-3">Add a random row</span>
          </Button>
        </div>
      ),
      rightView: <DataTable rows={rows_3} columns={columns_3} databaseName={newBranchName} />,
    },
    {
      label: 'Edited database',
      icon: 'https://www.svgrepo.com/show/532994/plus.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">But... I messed it up!</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(insertBranchTime > 0 && 'text-green-400')}>{insertBranchTime > 0 ? Math.round(insertBranchTime * 100) / 100 : '............'}</span> ms,
            you inserted a row in your copied database. But what if you wanted to restore to the initial state?
          </span>
          <Button
            onClick={() => {
              toast({
                duration: 4000,
                description: 'Requesting database restore...',
              })
              fetch('/project/reset?branchName=' + newBranchName)
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) setResetBranchTime(res.time)
                  toast({
                    duration: 10000,
                    description: 'Fetching data of the restored database...',
                  })
                  fetchData(newBranchName).then(() => {
                    setIsVisible(true)
                    setTimeout(() => {
                      setIsVisible(false)
                    }, 5000)
                  })
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-blue-400"
          >
            <TimerReset size="18" />
            <span className="ml-3">Restore the database</span>
          </Button>
        </div>
      ),
      rightView: <DataTable highlight={1} rows={rows_4} columns={columns_4} databaseName={newBranchName} />,
    },
    {
      label: 'Restored database',
      icon: 'https://www.svgrepo.com/show/521807/restore.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Yay, it{"'"}s back!</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(resetBranchTime > 0 && 'text-green-400')}>{resetBranchTime > 0 ? Math.round(resetBranchTime * 100) / 100 : '............'}</span> ms, you
            restored your copied database of <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB to it{"'"}s original state. To try
            this on your own data,{' '}
            <a className="text-green-400 underline" href="https://console.neon.tech/signup" target="_blank">
              Sign up for Neon
            </a>
            .
          </span>
          <Button
            variant="outline"
            onClick={() => {
              setStage(0)
              setRows2([])
              setRows3([])
              setRows4([])
              setRows5([])
              setColumns2([])
              setColumns3([])
              setColumns4([])
              setColumns5([])
              setNewBranchTime(0)
              setNewBranchSize(0)
              setNewBranchName('')
            }}
            className="mt-8 max-w-max bg-transparent text-gray-400"
          >
            <span className="ml-3">Restart the demo &rarr;</span>
          </Button>
        </div>
      ),
      rightView: <DataTable rows={rows_5} columns={columns_5} databaseName={newBranchName} />,
    },
  ]
  const [stageLength, setStageLength] = useState(stages.length)
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
            }
          }
          toast({
            duration: 4000,
            description: `Data from ${branchName} database loaded.`,
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
    if (stage === 1) {
      toast({
        duration: 4000,
        description: 'Fetching data and size of the main database...',
      })
      fetchData('main')
    } else if (stage === 2) {
      //
    } else if (stage === 3) {
      //
    } else if (stage === 4) {
      //
    } else if (stage === 5) {
      //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])
  return (
    <div className="flex flex-col items-center">
      <div className={cn('fixed left-0 top-0 h-screen w-screen', isVisible && stage === 5 ? 'z-[10000]' : 'z-[-1]')}>{isVisible && <Confetti />}</div>
      <div className="flex flex-row items-center gap-x-3">
        {new Array(stageLength).fill(0).map((i, _) => (
          <div key={_} className={cn('rounded-full', stage !== _ ? 'size-[6px] bg-white/50' : 'size-[8px] bg-white')} />
        ))}
      </div>
      <div className="mt-12 flex flex-row items-center">
        {new Array(stageLength).fill(0).map((i, _) => (
          <Fragment key={_}>
            <div className="relative flex flex-row">
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && stages[_].branched && (
                <div className={cn('branching-line', _ === stage ? 'bg-white' : 'bg-white/10')} />
              )}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && _ - 1 >= 0 && stages[_ - 1].branched && (
                <div className={cn('branching-line-begin', _ === stage ? 'bg-white' : 'bg-white/10')} />
              )}
              {stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched && <div className={cn('horizontal-line mt-6 w-[60px]', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && (
                <div
                  className={cn(
                    'horizontal-line',
                    _ === stage ? 'bg-white' : 'bg-white/10',
                    stages[_].branched || (_ - 1 >= 0 && stages[_ - 1].branched) ? '!w-[30px]' : '!w-[60px]',
                    _ - 1 >= 0 && stages[_ - 1].branched && 'ml-[30px]',
                  )}
                ></div>
              )}
            </div>
            <div
              className={cn(
                'relative mx-8 flex size-[80px] flex-col items-center justify-center rounded-full border',
                _ !== stage ? 'bg-white/10 opacity-50' : 'bg-white',
                stages[_].branched && 'mt-12',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-[30px] translate-x-0.5" src={stages[_].icon} alt="ChartJS" />
              <motion.span
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={cn('absolute -bottom-8 z-20 min-w-max max-w-max', _ === stage ? 'text-white' : 'text-white/10 opacity-10')}
              >
                {stages[_].label}
              </motion.span>
            </div>
          </Fragment>
        ))}
      </div>
      <div className={cn('my-24 grid w-full max-w-4xl grid-cols-1 gap-8', stages[stage]?.rightView && 'md:grid-cols-2')}>
        {stages[stage]?.leftView && <div className={cn('flex w-full flex-col p-4')}>{stages[stage].leftView}</div>}
        {stages[stage]?.rightView && <div className={cn('flex w-full flex-col p-4')}>{stages[stage].rightView}</div>}
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        <Button
          variant="outline"
          disabled={!prevOn || Boolean(stages[stage].prev) === false}
          className={cn((!prevOn || Boolean(stages[stage].prev) === false) && 'hidden', 'bg-transparent')}
          onClick={() => {
            setStage((stage) => {
              const tmp = stage - 1
              if (tmp < 0) return stageLength - 1
              return tmp % stageLength
            })
          }}
        >
          &larr; Prev
        </Button>
        <Button
          variant="outline"
          disabled={!nextOn || Boolean(stages[stage].next) === false}
          className={cn((!nextOn || Boolean(stages[stage].next) === false) && 'hidden', 'bg-transparent')}
          onClick={() => {
            setStage((stage) => {
              const tmp = (stage + 1) % stageLength
              return tmp
            })
          }}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  )
}
