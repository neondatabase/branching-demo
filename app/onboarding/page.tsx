'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Fragment, ReactElement, useState } from 'react'

interface Stage {
  icon: string
  branched: boolean
  next?: boolean
  prev?: boolean
  rightView?: ReactElement
  leftView?: ReactElement
}

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const stages: Stage[] = [
    {
      icon: 'https://www.svgrepo.com/show/526106/play.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Test's Branching Feature</span>
          <span className="mt-3 text-gray-400">Instantly branch your production database to create a staging environment for testing out schema changes.</span>
        </div>
      ),
      rightView: <span>table data</span>,
      next: true,
      prev: false,
    },
    {
      icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Test's Branching Feature</span>
          <span className="mt-3 text-gray-400">Instantly branch your production database to create a staging environment for testing out schema changes.</span>
        </div>
      ),
      rightView: <span>table data</span>,
      next: true,
      prev: true,
    },
    {
      icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Test's Branching Feature</span>
          <span className="mt-3 text-gray-400">Instantly branch your production database to create a staging environment for testing out schema changes.</span>
        </div>
      ),
      rightView: <span>table data</span>,
      next: true,
      prev: true,
    },
    {
      icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Test's Branching Feature</span>
          <span className="mt-3 text-gray-400">Instantly branch your production database to create a staging environment for testing out schema changes.</span>
        </div>
      ),
      rightView: <span>table data</span>,
      next: true,
      prev: true,
    },
    {
      icon: 'https://cdn.svgporn.com/logos/chartjs.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Test's Branching Feature</span>
          <span className="mt-3 text-gray-400">Instantly branch your production database to create a staging environment for testing out schema changes.</span>
        </div>
      ),
      rightView: <span>table data</span>,
      next: false,
      prev: true,
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
              {stages[_].branched && <div className={cn('branching-line', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              {_ - 1 >= 0 && stages[_ - 1].branched && <div className={cn('branching-line-begin', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              <div
                className={cn(
                  'horizontal-line',
                  _ === stage ? 'bg-white' : 'bg-white/10',
                  stages[_].branched || (_ - 1 >= 0 && stages[_ - 1].branched) ? '!w-[30px]' : '!w-[60px]',
                  _ - 1 >= 0 && stages[_ - 1].branched && 'ml-[30px]',
                )}
              ></div>
            </div>
            <div
              className={cn(
                'mx-8 flex size-[70px] flex-col items-center justify-center rounded-full border',
                _ !== stage ? 'bg-white/10 opacity-50' : 'bg-white',
                stages[_].branched && 'mt-12',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-[30px]" src={stages[_].icon} alt="ChartJS" />
            </div>
          </Fragment>
        ))}
      </div>
      <div className={cn('my-24 grid w-full max-w-4xl grid-cols-1 gap-8', stages[stage].rightView && 'md:grid-cols-2')}>
        {stages[stage].leftView && <div className="flex w-full flex-col border border-white/5 p-4">{stages[stage].leftView}</div>}
        {stages[stage].rightView && <div className="flex w-full flex-col border border-white/5 p-4">{stages[stage].rightView}</div>}
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        <Button
          variant="outline"
          disabled={!prevOn || (stages[stage].hasOwnProperty('prev') && stages[stage].prev === false)}
          className={cn((!prevOn || (stages[stage].hasOwnProperty('prev') && stages[stage].prev === false)) && 'hidden', 'bg-transparent')}
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
          disabled={!nextOn || (stages[stage].hasOwnProperty('next') && stages[stage].next === false)}
          className={cn((!nextOn || (stages[stage].hasOwnProperty('next') && stages[stage].next === false)) && 'hidden', 'bg-transparent')}
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
