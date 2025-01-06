import React, { useCallback, useEffect, useState } from 'react'
import socket from '../socketConfig'
import { toast } from 'react-toastify'
import '../styles/gamePage/guessStyles.css'

export function Guess({gameName, playerName, players, prevNum, setPrevNum, prevDie, setPrevDie, isCalzone, isMyTurn, setIsMyTurn}) {
  
  const [guessNum, setGuessNum] = useState(1)
  const [guessDie, setGuessDie] = useState(1)

  // for socket listener 'prevGuess'
  useEffect(() => {

    function setPrevGuess(data) {
      setPrevNum(data.prevNum)
      setPrevDie(data.prevDie)
    }
    
    socket.on('prevGuess', setPrevGuess)

    return () => {
      socket.off('prevGuess', setGuessDie)
    }

  }, [])

  // processes player guesses
  const guess = useCallback(() => {
    if(!isMyTurn) return

    // check if guess breaks calzone rules
    if(isCalzone && guessNum !== prevNum) {
      toast.warn('You can\'t change the Dice Value during calzone')
      socket.emit('calzoneViolation', gameName)
      return
    }
    
    // check guess validity
    if(guessNum < prevNum) {
      toast.warn('Dice Count must increase')
      return
    }

    if(guessNum === prevNum && guessDie <= prevDie) {
      toast.warn('Dice Count or Value must increase')
      return
    }
    
    socket.emit('guess', {guessNum, guessDie, gameName, playerName, players})
    setIsMyTurn(false)

  }, [isMyTurn, isCalzone, guessNum, prevNum, guessDie, prevDie, players])
    
  return (
    <div className='guess'>
      <label htmlFor="guessNum">How many dice? </label>
      <input className='guessNumIn'
        type="number"
        name="guessNum"
        id="guessNum"
        value={guessNum}
        onChange={e => setGuessNum(e.target.value)}
      />

      <label htmlFor="guessDie"> What dice value? </label>
      <select className='guessDieIn'
        name="guessDie"
        id="guessDie"
        value={guessDie}
        onChange={e => setGuessDie(e.target.value)}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>

      <button className='gameBtn'
        onClick={guess}>
          Guess
      </button>
    </div>
  )
}