import React from 'react'
import socket from '../socketConfig'

export function Bullshit({gameName, playerName, players, prevNum, prevDie, isCalzone, isMyTurn, setIsMyTurn, isFirstTurn}) {

  const bullshit = () => {
    if(!isMyTurn || isFirstTurn) return
    socket.emit('bullshit', {gameName, prevNum, prevDie, isCalzone, players, playerName})
    setIsMyTurn(false)
  }
  
  return (
    <button onClick={bullshit}>Bullshit!</button>
  )
}