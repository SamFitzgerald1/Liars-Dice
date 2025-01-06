import React, { useState } from 'react'
import { ShowCalzone } from './ShowCalzone'
import { ShowBullshit } from './ShowBullshit'
import { ShowGuess } from './ShowGuess'
import '../styles/gamePage/displayStyles.css'

export function Display({prevNum, prevDie}) {

  const [callerName, setCallerName] = useState('')
    
  return (
    <div className='display'>
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
    </div>
  )
}

