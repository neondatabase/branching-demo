'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CircleMinus, CirclePlus, TimerReset } from 'lucide-react'
import { Fragment, ReactElement, useState } from 'react'

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
  const stages: Stage[] = [
    {
      label: 'Welcome',
      icon: 'https://www.svgrepo.com/show/521608/document.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <h1 className="text-3xl font-semibold text-white">Copy database in milliseconds</h1>
          <span className="mt-3 font-light text-gray-400">
            In this demo, you will create a copy of your database, make changes in it, and restore it to the original copy in few clicks. Behind the scenes, you are leveraging the
            instant&nbsp;
            <a className="text-white/75 hover:underline hover:underline-offset-4" href="https://console.neon.tech/signup">
              Neon
            </a>{' '}
            branching.
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
      label: 'Origin database',
      icon: 'https://www.svgrepo.com/show/471315/database-02.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Create your own Postgres database</span>
          <span className="mt-3 text-gray-400">
            A Postgres database can be created{' '}
            <a className="border-b text-white" target="_blank" href="https://neon.tech/demos/instant-postgres">
              under seconds
            </a>{' '}
            with Neon. For now, we have prepared a database for you to copy. Currently, the size of this database is of about 10 GiB.
          </span>
          <Button
            onClick={() => {
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
      rightView: <span>table data</span>,
    },
    {
      label: 'Copied database',
      icon: 'https://www.svgrepo.com/show/445570/branch.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">I want to make changes in the copy</span>
          <span className="mt-3 text-gray-400">
            In about 300ms, you created a copy of your database. Now, let{"'"}s make some changes to make sure that it is an isolated copy of your origin database.
          </span>
          <Button
            variant="destructive"
            onClick={() => {
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max"
          >
            <CircleMinus size="18" />
            <span className="ml-3">Remove a Row</span>
          </Button>
        </div>
      ),
      rightView: <span>table data</span>,
    },
    {
      label: 'Edited database',
      icon: 'https://www.svgrepo.com/show/449277/subtract.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">I want to make more changes in the copy</span>
          <span className="mt-3 text-gray-400">
            In about 300ms, you dropped a row of your copied database. Now, let{"'"}s make some more changes to make sure that your data is quite different from origin database.
          </span>
          <Button
            onClick={() => {
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-green-400"
          >
            <CirclePlus size="18" />
            <span className="ml-3">Add a Row</span>
          </Button>
        </div>
      ),
      rightView: <span>table data</span>,
    },
    {
      label: 'Edited database',
      icon: 'https://www.svgrepo.com/show/532994/plus.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">But... I messed it up!</span>
          <span className="mt-3 text-gray-400">
            In about 300ms, you inserted a row in your copied database. But what if now you want to go back to the original state of the copied database?
          </span>
          <Button
            onClick={() => {
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-blue-400"
          >
            <TimerReset size="18" />
            <span className="ml-3">Restore the database</span>
          </Button>
        </div>
      ),
      rightView: <span>table data</span>,
    },
    {
      label: 'Restored database',
      icon: 'https://www.svgrepo.com/show/521807/restore.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Yay, it{"'"}s back!</span>
          <span className="mt-3 text-gray-400">In about 300ms, you restored your copied database to it{"'"}s original state. Feel free to edit your copied database, again.</span>
          <Button variant="outline" onClick={() => setStage(2)} className="mt-8 max-w-max bg-transparent text-gray-400">
            <span className="ml-3">I want to make changes &rarr;</span>
          </Button>
        </div>
      ),
      rightView: <span>table data</span>,
      next: false,
    },
  ]
  const [stageLength, setStageLength] = useState(stages.length)
  return (
    <div className="flex flex-col items-center">
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
              {stages[stage].label && (
                <span className={cn('absolute -bottom-8 z-20 min-w-max max-w-max', _ === stage ? 'text-white' : 'text-white/10 opacity-10')}>{stages[stage].label}</span>
              )}
            </div>
          </Fragment>
        ))}
      </div>
      <div className={cn('my-24 grid w-full max-w-4xl grid-cols-1 gap-8', stages[stage].rightView && 'md:grid-cols-2')}>
        {stages[stage].leftView && <div className="flex w-full flex-col p-4">{stages[stage].leftView}</div>}
        {stages[stage].rightView && <div className="flex w-full flex-col p-4">{stages[stage].rightView}</div>}
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
