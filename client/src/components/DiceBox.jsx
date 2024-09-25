import React, { useEffect, useState } from 'react'

import DiceImage0 from '../images/dice0.jpg'
import DiceImage1 from '../images/Dice1.png'
import DiceImage2 from '../images/Dice2.png'
import DiceImage3 from '../images/Dice3.png'
import DiceImage4 from '../images/Dice4.png'
import DiceImage5 from '../images/Dice5.png'
import DiceImage6 from '../images/Dice6.png'

import socket from '../socketConfig'

const DICE_IMAGES = {
  0: DiceImage0,
  1: DiceImage1,
  2: DiceImage2,
  3: DiceImage3,
  4: DiceImage4,
  5: DiceImage5,
  6: DiceImage6
}

// for converting dice images to number values
const DICE_IMAGE_KEYS = [0, 1, 2, 3, 4, 5, 6]

export function DiceBox({gameName, playerName, setPrevNum, setPrevDie, diceLeft, setDiceLeft, isMyTurn, setIsFirstTurn}) {

  const [dice, setDice] = useState({
    die1: DICE_IMAGES[Math.floor(Math.random() * 6) + 1],
    die2: DICE_IMAGES[Math.floor(Math.random() * 6) + 1],
    die3: DICE_IMAGES[Math.floor(Math.random() * 6) + 1],
    die4: DICE_IMAGES[Math.floor(Math.random() * 6) + 1],
    die5: DICE_IMAGES[Math.floor(Math.random() * 6) + 1]
  })

  // sends user's dice data to the server upon update
  useEffect(() => {

    // convert the die's image value to the correct number
    const diceInfo = {
      die1: DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice.die1),
      die2: DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice.die2),
      die3: DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice.die3),
      die4: DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice.die4),
      die5: DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice.die5)
    }
    
    socket.emit('diceInfo', {gameName, diceInfo})

  }, [dice])

  // for socket listener 'roundEnd'
  useEffect(() => {

    // handles change between current and next round
    function endRound(data) {

      const tempDice = Object.assign({}, dice)

      // remove one die from losing player
      if(playerName === data) {
        for(let key of Object.keys(tempDice)) {
          if(tempDice[key] !== 0) {
            tempDice[key] = 0
            break
          }
        }
      }

      tempDice.die1 = tempDice.die1 !== 0 ? DICE_IMAGES[Math.floor(Math.random() * 6) + 1] : DICE_IMAGES[0]
      tempDice.die2 = tempDice.die2 !== 0 ? DICE_IMAGES[Math.floor(Math.random() * 6) + 1] : DICE_IMAGES[0]
      tempDice.die3 = tempDice.die3 !== 0 ? DICE_IMAGES[Math.floor(Math.random() * 6) + 1] : DICE_IMAGES[0]
      tempDice.die4 = tempDice.die4 !== 0 ? DICE_IMAGES[Math.floor(Math.random() * 6) + 1] : DICE_IMAGES[0]
      tempDice.die5 = tempDice.die5 !== 0 ? DICE_IMAGES[Math.floor(Math.random() * 6) + 1] : DICE_IMAGES[0]

      setDice(tempDice)

      // reset value of previous guess set in Guess.jsx
      setPrevNum(0)
      setPrevDie(0)
      
      socket.emit('roundStart', {gameName: gameName, loser: data})

    }
    
    socket.on('roundEnd', endRound)

    return () => {
      socket.off('roundEnd', endRound)
    }
    
  }, [])

  return (
    <>
      <img src={dice.die1} />
      <img src={dice.die2} />
      <img src={dice.die3} />
      <img src={dice.die4} />
      <img src={dice.die5} />
    </>
  )
}