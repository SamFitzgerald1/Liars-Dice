import React, { useCallback } from 'react'
import socket from '../socketConfig'

export function Bullshit({gameName, playerName, players, prevNum, prevDie, isCalzone, isMyTurn, setIsMyTurn, isFirstTurn}) {

  const bullshit = useCallback(() => {
    // check if bullshit call is allowed
    if(!isMyTurn || isFirstTurn) return
    
    socket.emit('bullshit', {gameName, prevNum, prevDie, isCalzone, players, playerName})
    setIsMyTurn(false)
  }, [isMyTurn, isFirstTurn, prevNum, prevDie, isCalzone, players])
  
  return (
    <div className='bullshit'>
      <button className='gameBtn'
        onClick={bullshit}>
          Bullshit!
      </button>
    </div>
  )
}