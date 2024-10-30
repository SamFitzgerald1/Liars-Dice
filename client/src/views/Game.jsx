import React, {useState, useEffect} from 'react'
import socket from '../socketConfig'
import { DiceBox } from '../components/DiceBox'
import { Players } from '../components/Players'
import { Guess } from '../components/Guess'
import { Bullshit } from '../components/Bullshit'
import { Calzone } from '../components/Calzone'
import { TurnIndicator } from '../components/TurnIndicator'
import { Display } from '../components/Display'

export function Game({gameName, playerName, players}) {
    
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [isFirstTurn, setIsFirstTurn] = useState(false)

  const [prevNum, setPrevNum] = useState(0)
  const [prevDie, setPrevDie] = useState(0)

  const [diceLeft, setDiceLeft] = useState(5)
  const [isOut, setIsOut] = useState(false)

  const [isCalzone, setIsCalzone] = useState(false)
  const [hasCalzoned, setHasCalzoned] = useState(false)

  // starts the first turn of the game
  useEffect(() => {
    setIsMyTurn(playerName === players[0])
  }, [])

  // socket listener for 'startTurn'
  useEffect(() => {

    function turnStart(data) {

      // for checking if calzone call is allowable !!!MAY GET MOVED!!!
      setIsFirstTurn(data.isFirstTurn)
      
      setIsMyTurn(data.playerName === playerName)

      // check if player is still in the game
      if(isOut) {
        setIsMyTurn(false)
        socket.emit('skip', {gameName: gameName, playerName: playerName, players: players, isFirstTurn: data.isFirstTurn})
      }
    }

    socket.on('startTurn', turnStart)

    return () => {
      socket.off('startTurn', turnStart)
    }

  }, [isOut])
  
  useEffect(() => {
    socket.emit('playerOut', {gameName: gameName, isOut: isOut})
  }, [isOut])

  return (
    <>
      {isMyTurn && <TurnIndicator />}
      <DiceBox gameName={gameName} playerName={playerName} setPrevNum={setPrevNum} setPrevDie={setPrevDie} diceLeft={diceLeft} setDiceLeft={setDiceLeft} isMyTurn={isMyTurn} setIsFirstTurn={setIsFirstTurn} setIsCalzone={setIsCalzone} setIsOut={setIsOut} />
      <Guess gameName={gameName} playerName={playerName} players={players} prevNum={prevNum} setPrevNum={setPrevNum} prevDie={prevDie} setPrevDie={setPrevDie} isCalzone={isCalzone} isMyTurn={isMyTurn} setIsMyTurn={setIsMyTurn} isFirstTurn={isFirstTurn} setIsFirstTurn={setIsFirstTurn} />
      <Bullshit gameName={gameName} playerName={playerName} players={players} prevNum={prevNum} prevDie={prevDie} isCalzone={isCalzone} isMyTurn={isMyTurn} setIsMyTurn={setIsMyTurn} isFirstTurn={isFirstTurn} />
      <Calzone gameName={gameName} setIsCalzone={setIsCalzone} isMyTurn={isMyTurn} isFirstTurn={isFirstTurn} hasCalzoned={hasCalzoned} setHasCalzoned={setHasCalzoned} />
      <Display prevNum={prevNum} prevDie={prevDie} />
      <Players players={players} />
    </>
  )
}
