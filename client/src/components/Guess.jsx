import React, { useEffect, useState } from 'react'
import socket from '../socketConfig'
import { toast } from 'react-toastify'

export function Guess({gameName}) {

  const [prevNum, setPrevNum] = useState(0)
  const [prevDie, setPrevDie] = useState(0)
  
  const [guessNum, setGuessNum] = useState(1)
  const [guessDie, setGuessDie] = useState(1)

  useEffect(() => {
    socket.on('prevGuess', data => {
      setPrevNum(data.prevNum)
      setPrevDie(data.prevDie)
    })
  }, [socket])

  const guess = () => {
    if(guessNum < prevNum) {
      toast.warn('Dice Count must increase', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark"
      });
      return
    }
    if(guessNum === prevNum && guessDie <= prevDie) {
      toast.warn('Dice Count or Value must increase', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark"
      });
      return
    }
    socket.emit('guess', {guessNum, guessDie, gameName})
  }
    
  return (
    <>
      <label htmlFor="guessNum">How many dice</label>
      <input
        type="number"
        name="guessNum"
        id="guessNum"
        value={guessNum}
        onChange={e => setGuessNum(e.target.value)}
        min="1"
      />

      <label htmlFor="guessDie">What dice value</label>
      <select
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

      <button onClick={guess}>Guess</button>
    </>
  )
}