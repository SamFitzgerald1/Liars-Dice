import React, { useEffect } from 'react'
import { Stats } from '../components/Stats'
import { EndButtons } from '../components/EndButtons'
import '../styles/winPage/winPageStyles.css'
import logo from '../images/LIAR-S-DICE-12-19-2024.png'
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
    <div className='win'>
      <img className='logo'
        src={logo}
        alt="Liar's Dice Logo"
      />
      <Stats
        gameName={gameName}
        players={players}
      />
      <EndButtons
        gameName={gameName}
        players={players}
        playerName={playerName}
      />
    </div>
  )
}