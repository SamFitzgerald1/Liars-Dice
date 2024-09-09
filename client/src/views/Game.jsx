import React, {useState, useEffect} from 'react'
import socket from '../socketConfig'
import { DiceBox } from '../components/DiceBox'
import { Players } from '../components/Players'
import { Guess } from '../components/Guess'

export function Game({gameName, playerName, players}) {
    
  const [isMyTurn, setIsMyTurn] = useState(false)

  useEffect(() => {
    if(playerName === players[0]) setIsMyTurn(true)
  }, [])

  // useEffect(() => {
  //   socket.on('startTurn', data => {
  //     if(data === playerName) setIsMyTurn(true)
  //   })
  // }, [socket])

  const turn = () => {
    if(!isMyTurn) return
    console.log('Action')
    setIsMyTurn(false)
    socket.emit('endTurn', {gameName, playerName, players})
  }

  return (
    <>
      <button onClick={turn}>Action!</button>
      <DiceBox />
      <Guess gameName={gameName} />
      <Players players={players} />
    </>
  )
}
