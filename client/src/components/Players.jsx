import React, { useEffect } from 'react'
import socket from '../socketConfig'
import '../styles/componentStyles/playersStyles.css'

export function Players({players, setPlayers, gameName}) {

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
    <div className='players'>
      <h1 className='gameName'>{gameName}</h1>
      <ul className='playerList'>
        {players.map(player => <li className='player' key={player}>{player}</li>)}
      </ul>
    </div>
  )
}