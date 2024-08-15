import socket from '../socketConfig'

export function Home({gameName, setGameName, setPage}) {

  const joinGame = () => {
    socket.emit('joinGame', gameName)
    setPage('lobby')
  }

  return (
    <>
      <input
        type="text"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && joinGame}
      />
      <button onClick={joinGame}>Join or Create Game</button>
    </>
  )
}