import React, { useEffect } from 'react'
import socket from '../socketConfig'

export function Players({players, setPlayers}) {

  // socket listener for leave
  useEffect(() => {

    function playerLeft(data) {
      setPlayers(currentPlayers => {
        return currentPlayers.filter(player => player !== data)
      })
    }

    socket.on('leave', playerLeft)

    return () => {
      socket.off('leave', playerLeft)
    }

  }, [players])

  return (
    <>
      <h1>Players</h1>
      <ul>
        {players.map(player => <li key={player}>{player}</li>)}
      </ul>
    </>
  )
}