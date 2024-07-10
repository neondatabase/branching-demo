'use client'

import { useState } from 'react'

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [stageLength, setStageLength] = useState(6)
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center gap-x-3">
        {new Array(stageLength).fill(0).map((i, _) => (
          <div key={_} className={'rounded-full ' + (stage !== _ ? 'size-[6px] bg-white/50' : 'size-[8px] bg-white')} />
        ))}
      </div>
    </div>
  )
}
