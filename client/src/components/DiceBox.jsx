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

  const [image1, setImage1] = useState(DICE_IMAGES[1])
  const [image2, setImage2] = useState(DICE_IMAGES[1])
  const [image3, setImage3] = useState(DICE_IMAGES[1])
  const [image4, setImage4] = useState(DICE_IMAGES[1])
  const [image5, setImage5] = useState(DICE_IMAGES[1])
  const [image6, setImage6] = useState(DICE_IMAGES[1])
  
  return (
    <>
      <img src={image1} />
      <img src={image2} />
      <img src={image3} />
      <img src={image4} />
      <img src={image5} />
      <img src={image6} />
    </>
  )
}
