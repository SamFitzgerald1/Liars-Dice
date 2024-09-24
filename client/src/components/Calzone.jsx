import React from 'react'
import socket from '../socketConfig'

export function Calzone({setIsCalzone, isMyTurn, isFirstTurn, hasCalzoned, setHasCalzoned}) {

    const calzone = () => {
      if(!isMyTurn || !isFirstTurn || hasCalzoned) {
        socket.emit('calzoneViolation')
        return
      }
      setIsCalzone(true)
      setHasCalzoned(true)
    }
    
  return (
    <>
      <button onClick={calzone}>Calzone!</button>
    </>
  )
}