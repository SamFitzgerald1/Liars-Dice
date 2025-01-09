import React, { useEffect, useState } from 'react'
import socket from '../socketConfig'

export function TurnIndicator({players, isMyTurn}) {

  const [playersTurn, setPlayersTurn] = useState(players[0])

  // socket listener for startTurn
  useEffect(() => {
    
    function turnSet(data) {
      setPlayersTurn(data.playerName)
    }
    
    socket.on('startTurn', turnSet)

    return () => {
      socket.off('startTurn', turnSet)
    }
    
  }, [])
  
  return (
    <div className='turnIndicator'>
      {isMyTurn ? <p>Your Turn</p> : <p>{playersTurn}'s Turn</p>}
    </div >
  )
}