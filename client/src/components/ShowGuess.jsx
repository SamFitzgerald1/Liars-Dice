import React, { useState, useEffect } from 'react'
import socket from '../socketConfig'

export function ShowGuess({prevNum, prevDie}) {
  
  const [guesserName, setGuesserName] = useState('')
  
  // socket listener for prevGuess
  useEffect(() => {

    function guesserNameSet(data) {
        setGuesserName(data.guesserName)
    }
    
    socket.on('prevGuess', guesserNameSet)

    return () => {
        socket.off('prevGuess', guesserNameSet)
    }
      
  }, [])
  
  return (
    <div className='guessDisplay'>
      {(guesserName && prevDie !== 0) && <p>{guesserName} says there are {prevNum} {prevDie}s</p>}
    </div>
  )
}

