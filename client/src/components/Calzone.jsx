import React from 'react'
import socket from '../socketConfig'

export function Calzone({setIsCalzone, isMyTurn, isFirstTurn, hasCalzoned, setHasCalzoned}) {

    const calzone = () => {

      // check if calzone call is allowed 
      if(!isMyTurn || !isFirstTurn || hasCalzoned) return

      setIsCalzone(true)
      setHasCalzoned(true)
      
    }
    
  return (
    <>
      <button onClick={calzone}>Calzone!</button>
    </>
  )
}