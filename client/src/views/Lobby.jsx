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

  useEffect(() => {
    socket.on('gamePage', () => {
      setPage('game')
    })
  }, [])

  const startGame = () => {
    socket.emit('startGame', gameName)
  }
  
  return (
    <>
      <button onClick={startGame}>Start Game</button>
      <Players players={players} />
    </>
  )
}
