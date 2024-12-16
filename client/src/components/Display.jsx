import React, { useState } from 'react'
import { ShowCalzone } from './ShowCalzone'
import { ShowBullshit } from './ShowBullshit'
import { ShowGuess } from './ShowGuess'

export function Display({prevNum, prevDie}) {

  const [callerName, setCallerName] = useState('')
    
  return (
    <>
      <ShowGuess
        prevNum={prevNum}
        prevDie={prevDie}
      />
      <ShowCalzone
        callerName={callerName}
        setCallerName={setCallerName}
      />
      <ShowBullshit
        callerName={callerName}
        setCallerName={setCallerName}
      />
    </>
  )
}

