'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const [stageLength, setStageLength] = useState(6)
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center gap-x-3">
        {new Array(stageLength).fill(0).map((i, _) => (
          <div key={_} className={'rounded-full ' + (stage !== _ ? 'size-[6px] bg-white/50' : 'size-[8px] bg-white')} />
        ))}
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        {new Array(stageLength).fill(0).map((i, _) => (
          <div key={_} className={'flex size-[70px] flex-col items-center justify-center rounded-full border ' + (_ !== stage ? 'bg-white/10 opacity-10' : 'bg-white')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-[30px]" src="https://cdn.svgporn.com/logos/chartjs.svg" alt="ChartJS" />
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        <button
          disabled={!prevOn}
          className={cn(!prevOn && 'opacity-10')}
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
          disabled={!nextOn}
          className={cn(!nextOn && 'opacity-10')}
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
