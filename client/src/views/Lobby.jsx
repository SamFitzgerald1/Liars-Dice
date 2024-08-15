import { useEffect } from "react"
import socket from "../socketConfig"

export function Lobby({gameName, setPage, players, setPlayers}) {

  useEffect(() => {
    socket.emit('getPlayers', gameName)
  }, [])

  // useEffect(() => {
  //   socket.on()
  // }, [socket])
  
  return (
    <>
      <button onclick={() => setPage('game')}>Start Game</button>
    </>
  )
}
