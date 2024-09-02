import { useState } from 'react'
import { Home } from './views/Home'
import { Game } from './views/Game'
import { Lobby } from './views/Lobby'

function App() {

  const [page, setPage] = useState('home')
  const [gameName, setGameName] = useState('')
  const [players, setPlayers] = useState([])
  const [playerName, setPlayerName] = useState('')

  return (
    <>
      {page === 'home' && <Home gameName={gameName} setGameName={setGameName} setPage={setPage} playerName={playerName} setPlayerName={setPlayerName} />}
      {page === 'lobby' && <Lobby gameName={gameName} setPage={setPage} players={players} setPlayers={setPlayers} />}
      {page === 'game' && <Game gameName={gameName} playerName={playerName} players={players} />}
    </>
  )
}

export default App
