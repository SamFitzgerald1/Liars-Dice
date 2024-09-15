import React, { useEffect, useState } from 'react'

import DiceImage1 from '../images/Dice1.png'
import DiceImage2 from '../images/Dice2.png'
import DiceImage3 from '../images/Dice3.png'
import DiceImage4 from '../images/Dice4.png'
import DiceImage5 from '../images/Dice5.png'
import DiceImage6 from '../images/Dice6.png'

import socket from '../socketConfig'

const DICE_IMAGES = {
  1: DiceImage1,
  2: DiceImage2,
  3: DiceImage3,
  4: DiceImage4,
  5: DiceImage5,
  6: DiceImage6
}

const DICE_IMAGE_KEYS = [1, 2, 3, 4, 5, 6]

export function DiceBox({gameName, playerName, setPrevNum, setPrevDie, diceLeft, setDiceLeft, isMyTurn, setIsFirstTurn}) {

  const [dice1, setDice1] = useState(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
  const [dice2, setDice2] = useState(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
  const [dice3, setDice3] = useState(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
  const [dice4, setDice4] = useState(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
  const [dice5, setDice5] = useState(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])

  const [diceInfo, setDiceInfo] = useState({
    'dice1': DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice1),
    'dice2': DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice2),
    'dice3': DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice3),
    'dice4': DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice4),
    'dice5': DICE_IMAGE_KEYS.find(key => DICE_IMAGES[key] === dice5)
  })

  useEffect(() => {
    socket.emit('diceInfo', {gameName, diceInfo})
  }, [])

  useEffect(() => {
    socket.on('roundEnd', data => {
      if(playerName === data) {
        switch (diceLeft) {
          case 5: 
            console.log('2')
            setDice1(0)
            setDiceLeft(4)
            break
          case 4:
            setDice2(0)
            setDiceLeft(3)
            break
          case 3:
            setDice3(0)
            setDiceLeft(2)
            break
          case 2:
            setDice4(0)
            setDiceLeft(1)
            break
          case 1:
            setDice5(0)
            setDiceLeft(0)
            break
        }
      }
      if(dice1 === 0) setDice1(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
      if(dice2 === 0) setDice2(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
      if(dice3 === 0) setDice3(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
      if(dice4 === 0) setDice4(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
      if(dice5 === 0) setDice5(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])

      setDiceInfo({
        'dice1': dice1,
        'dice2': dice2,
        'dice3': dice3,
        'dice4': dice4,
        'dice5': dice5
      })
      setPrevNum(0)
      setPrevDie(0)
      socket.emit('roundStart', {gameName: gameName, loser: data})
      socket.emit('diceInfo', {gameName, diceInfo})
    })
  }, [socket])

  return (
    <>
      <img src={dice1} />
      <img src={dice2} />
      <img src={dice3} />
      <img src={dice4} />
      <img src={dice5} />
    </>
  )
}