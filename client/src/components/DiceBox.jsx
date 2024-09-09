import React, { useState } from 'react'

import DiceImage1 from '../images/Dice1.png'
import DiceImage2 from '../images/Dice2.png'
import DiceImage3 from '../images/Dice3.png'
import DiceImage4 from '../images/Dice4.png'
import DiceImage5 from '../images/Dice5.png'
import DiceImage6 from '../images/Dice6.png'

export function DiceBox() {
  const DICE_IMAGES = {
    1: DiceImage1,
    2: DiceImage2,
    3: DiceImage3,
    4: DiceImage4,
    5: DiceImage5,
    6: DiceImage6
  }

  const [dice1, setDice1] = useState(DICE_IMAGES[1])
  const [dice2, setDice2] = useState(DICE_IMAGES[1])
  const [dice3, setDice3] = useState(DICE_IMAGES[1])
  const [dice4, setDice4] = useState(DICE_IMAGES[1])
  const [dice5, setDice5] = useState(DICE_IMAGES[1])

  const roll = () => {
    setDice1(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
    setDice2(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
    setDice3(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
    setDice4(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
    setDice5(DICE_IMAGES[Math.floor(Math.random() * 6) + 1])
  }

  return (
    <>
      <img src={dice1} />
      <img src={dice2} />
      <img src={dice3} />
      <img src={dice4} />
      <img src={dice5} />
      <button onClick={roll}>Roll</button>
    </>
  )
}
