import socket from '../socketConfig'

export function Home({gameName, setGameName, setPage}) {

  const joinGame = gameName => {
    socket.emit('joinGame', gameName)
    setPage('game')
  }

  return (
    <>
      <input
        type="text"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && joinGame(gameName)}
      />
      <button onClick={() => joinGame(gameName)}>Join or Create Game</button>
    </>
  )
}