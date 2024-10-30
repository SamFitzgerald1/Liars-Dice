import { useCallback } from 'react'
import socket from '../socketConfig'
import { toast } from 'react-toastify'

export function Home({gameName, setGameName, setPage, playerName, setPlayerName}) {

  const joinGame = useCallback(() => {

    if(playerName === '') {
      toast.warn('No Username')
      return
    }

    socket.emit('joinGame', {gameName, playerName})
    setPage('lobby')
    
  }, [playerName, gameName])

  return (
    <>
      <input
        type='text'
        placeholder='Player Name' 
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      <input
        type='text'
        placeholder='Game Name'
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && joinGame}
      />
      <button onClick={joinGame}>Join or Create Game</button>
    </>
  )
}