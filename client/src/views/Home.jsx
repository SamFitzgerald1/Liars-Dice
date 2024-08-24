import socket from '../socketConfig'

export function Home({gameName, setGameName, setPage}) {

  const joinGame = () => {
    socket.emit('joinGame', {gameName, username})
    setPage('lobby')
  }

  return (
    <>
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