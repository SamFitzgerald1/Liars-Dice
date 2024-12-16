import React, { useEffect } from 'react'
import { Stats } from '../components/Stats'
import { EndButtons } from '../components/EndButtons'
import socket from '../socketConfig'

export function Win({gameName, players, playerName}) {

  // socket listener for 'lobbyPage'
  useEffect(() => {

    function setPageLobby() {
      setPage('lobby')
    }

    socket.on('lobbyPage', setPageLobby)

    return () => {
      socket.off('lobbyPage', setPageLobby)
    }

  }, [])
  
  return (
    <>
      You Win!!!
      <Stats
        gameName={gameName}
        players={players}
      />
      <EndButtons
        gameName={gameName}
        players={players}
        playerName={playerName}
      />
    </>
  )
}