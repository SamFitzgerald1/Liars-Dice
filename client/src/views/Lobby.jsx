import { useEffect } from "react"
import socket from "../socketConfig"
import { Players } from "../components/Players"

export function Lobby({gameName, setPage, players, setPlayers}) {

  useEffect(() => {
    socket.emit('getPlayers', gameName)
  }, [])

  useEffect(() => {
    socket.on('givePlayers', data => {
      setPlayers(data)
    })
  }, [socket])
  
  return (
    <>
      <button onclick={() => setPage('game')}>Start Game</button>
      <Players players={players} />
    </>
  )
}
