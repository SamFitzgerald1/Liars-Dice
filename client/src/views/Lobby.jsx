import { useCallback, useEffect } from "react"
import socket from "../socketConfig"
import { Players } from "../components/Players"
import '../styles/lobbyPage/lobbyPageStyles.css'

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
    socket.emit('startGame', {gameName: gameName, players: players})
  }, [players])
  
  return (
    <div className="lobby">
      <button className="btn startGame"
        onClick={startGame}>
          Start Game
      </button>
      <Players className="players"
        players={players}
        setPlayers={setPlayers}
        gameName={gameName}
      />
    </div>
  )
}
