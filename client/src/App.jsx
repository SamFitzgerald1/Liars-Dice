import { useState } from 'react'
import { Home } from './views/Home'
import { Game } from './views/Game'

function App() {

  const [page, setPage] = useState('home')
  const [gameName, setGameName] = useState('')

  return (
    <>
      {page === 'home' && <Home gameName={gameName} setGameName={setGameName} setPage={setPage}/>}
      {page === 'game' && <Game gameName={gameName} />}
    </>
  )
}

export default App
