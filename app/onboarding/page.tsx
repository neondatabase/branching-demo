'use client'

import { cn } from '@/lib/utils'
import { Fragment, useState } from 'react'

const stages = [
  {
    icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
    branched: false,
    h1: "Test's Branching Feature",
    h2: 'Instantly branch your production database to create a staging environment for testing out schema changes.',
    next: true,
    prev: false,
  },
  {
    icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
    branched: true,
    h1: "Test's Branching Feature",
    h2: 'Instantly branch your production database to create a staging environment for testing out schema changes.',
    next: true,
    prev: true,
  },
  {
    icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
    branched: false,
    h1: "Test's Branching Feature",
    h2: 'Instantly branch your production database to create a staging environment for testing out schema changes.',
    next: true,
    prev: true,
  },
  {
    icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
    branched: false,
    h1: "Test's Branching Feature",
    h2: 'Instantly branch your production database to create a staging environment for testing out schema changes.',
    next: true,
    prev: true,
  },
  {
    icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
    branched: false,
    h1: "Test's Branching Feature",
    h2: 'Instantly branch your production database to create a staging environment for testing out schema changes.',
    next: false,
    prev: true,
  },
]

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
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
              {stages[_].branched && <div className={cn('branching-line', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              <div className={cn('horizontal-line', _ === stage ? 'bg-white' : 'bg-white/10', stages[_].branched ? '!w-[30px]' : '!w-[60px]')}></div>
              {/* {!stages[_].branched && <div className="horizontal-line !w-[30px] bg-white" />} */}
            </div>
            <div
              className={cn(
                'mx-8 flex size-[70px] flex-col items-center justify-center rounded-full border',
                _ !== stage ? 'bg-white/10 opacity-50' : 'bg-white',
                stages[_].branched && 'mt-12',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-[30px]" src={stages[stage].icon} alt="ChartJS" />
            </div>
          </Fragment>
        ))}
      </div>
      <div className="my-24 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex w-full flex-col border border-white/5 p-4">
          <span className="text-xl font-medium">{stages[stage].h1}</span>
          <span className="mt-3 text-gray-400">{stages[stage].h2}</span>
        </div>
        <div className="flex w-full flex-col border border-white/5 p-4">
          <span>table data </span>
        </div>
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        <button
          disabled={!prevOn || (stages[stage].hasOwnProperty('prev') && stages[stage].prev === false)}
          className={cn((!prevOn || (stages[stage].hasOwnProperty('prev') && stages[stage].prev === false)) && 'hidden')}
          onClick={() => {
            setStage((stage) => {
              const tmp = stage - 1
              if (tmp < 0) return stageLength - 1
              return tmp % stageLength
            })
          }}
        >
          Prev
        </button>
        <button
          disabled={!nextOn || (stages[stage].hasOwnProperty('next') && stages[stage].next === false)}
          className={cn((!nextOn || (stages[stage].hasOwnProperty('next') && stages[stage].next === false)) && 'hidden')}
          onClick={() => {
            setStage((stage) => {
              const tmp = (stage + 1) % stageLength
              return tmp
            })
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
