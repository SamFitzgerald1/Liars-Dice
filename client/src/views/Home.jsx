import { useCallback } from 'react'
import socket from '../socketConfig'
import { toast } from 'react-toastify'

export function Home({gameName, setGameName, setPage, playerName, setPlayerName}) {

  // const joinGame = () => {
  //   if(playerName === '') {
  //     toast.warn('No username', {
  //       position: "bottom-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: false,
  //       progress: undefined,
  //       theme: "dark"
  //     });
  //     return
  //   }
  //   socket.emit('joinGame', {gameName, playerName})
  //   setPage('lobby')
  // }

  const joinGame = useCallback(() => {

    if(playerName === '') {
      toast.warn('No Username', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark"
      })
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