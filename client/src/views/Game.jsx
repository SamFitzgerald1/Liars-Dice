import React, {useState, useEffect} from 'react'
import socket from '../socketConfig'
import { DiceBox } from '../components/DiceBox'
import { Players } from '../components/Players'
import { Guess } from '../components/Guess'
import { Bullshit } from '../components/Bullshit'
import { Calzone } from '../components/Calzone'
import { TurnIndicator } from '../components/TurnIndicator'

export function Game({gameName, playerName, players}) {
    
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [isFirstTurn, setIsFirstTurn] = useState(false)

  const [prevNum, setPrevNum] = useState(0)
  const [prevDie, setPrevDie] = useState(0)

  const [diceLeft, setDiceLeft] = useState(5)

  const [isCalzone, setIsCalzone] = useState(false)
  const [hasCalzoned, setHasCalzoned] = useState(false)

  useEffect(() => {
    setIsMyTurn(playerName === players[0])
  }, [])

  useEffect(() => {
    socket.on('startTurn', data => {
      setIsFirstTurn(data.isFirstTurn)
      setIsMyTurn(data.player === playerName)
      if(diceLeft === 0) {
        setIsMyTurn(false)
        socket.emit('skip', {gameName: gameName, playerName: playerName, players: players, isFirstTurn: data.isFirstTurn})
      }
    })
  }, [socket])

  return (
    <>
      {isMyTurn && <TurnIndicator />}
      <DiceBox gameName={gameName} playerName={playerName} setPrevNum={setPrevNum} setPrevDie={setPrevDie} diceLeft={diceLeft} setDiceLeft={setDiceLeft} isMyTurn={isMyTurn} setIsFirstTurn={setIsFirstTurn} />
      <Guess gameName={gameName} playerName={playerName} players={players} prevNum={prevNum} setPrevNum={setPrevNum} prevDie={prevDie} setPrevDie={setPrevDie} isCalzone={isCalzone} isMyTurn={isMyTurn} setIsMyTurn={setIsMyTurn} isFirstTurn={isFirstTurn} setIsFirstTurn={setIsFirstTurn} />
      <Bullshit gameName={gameName} playerName={playerName} players={players} prevNum={prevNum} prevDie={prevDie} isCalzone={isCalzone} isMyTurn={isMyTurn} setIsMyTurn={setIsMyTurn} isFirstTurn={isFirstTurn} />
      <Calzone setIsCalzone={setIsCalzone} isMyTurn={isMyTurn} isFirstTurn={isFirstTurn} hasCalzoned={hasCalzoned} setHasCalzoned={setHasCalzoned} />
      <Players players={players} />
    </>
  )
}
