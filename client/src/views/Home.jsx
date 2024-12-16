import { useCallback, useEffect } from 'react'
import socket from '../socketConfig'
import { toast } from 'react-toastify'

export function Home({gameName, setGameName, setPage, playerName, setPlayerName}) {

  // socket listener for nameTaken
  useEffect(() => {

    function taken() {
      toast.warn('Name in use Within Chosen Game')
    }

    socket.on('nameTaken', taken)

    return () => {
      socket.off('nameTaken', taken)
    }

  }, [])

  // socket listener for inProg
  useEffect(() => {

    function inProgress() {
      toast.warn('This Game is in Already Progress')
    }

    socket.on('inProg', inProgress)

    return () => {
      socket.off('inProg', inProgress)
    }
    
  }, [])

  // socket listener for joinSuccess
  useEffect(() => {

    function success() {
      setPage('lobby')
    }

    socket.on('joinSuccess', success)

    return () => {
      socket.off('joinSuccess', success)
    }
    
  }, [])
  
  const joinGame = useCallback(() => {

    if(playerName === '') {
      toast.warn('No Username')
      return
    }

    if(gameName == '') {
      toast.warn('No Game Name')
      return
    }

    socket.emit('joinGame', {gameName, playerName})
    
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