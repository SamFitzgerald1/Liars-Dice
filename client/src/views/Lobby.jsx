import { useCallback, useEffect } from "react"
import socket from "../socketConfig"
import { Players } from "../components/Players"

export function Lobby({gameName, setPage, players, setPlayers}) {

  // requests list of players in game from server
  useEffect(() => {
    socket.emit('getPlayers', gameName)
  }, [])

  // socket listener for 'givePlayers'
  useEffect(() => {

    function setPlayerList(data) {
      setPlayers(data)
    }

    socket.on('givePlayers', setPlayerList)

    return () => {
      socket.off('givePlayers', setPlayerList)
    }

  }, [])

  // socket listener for 'gamePage'
  useEffect(() => {

    function setPageGame() {
      setPage('game')
    }

    socket.on('gamePage', setPageGame)

    return () => {
      socket.off('gamePage', setPageGame)
    }

  }, [])

  const startGame = useCallback(() => {
    console.log(players)
    socket.emit('startGame', {gameName: gameName, players: players})
  }, [players])
  
  return (
    <>
      <button onClick={startGame}>Start Game</button>
      <Players
        players={players}
        setPlayers={setPlayers}
      />
    </>
  )
}
