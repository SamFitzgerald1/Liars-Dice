import React, { useEffect, useState } from 'react'
import socket from '../socketConfig'

export function ShowBullshit({callerName, setCallerName}) {

    const [bullshitAlert, setBullshitAlert] = useState(false)
    const [dieLoser, setDieLoser] = useState('')
    const [value, setValue] = useState()
    const [amount, setAmount] = useState()

  // socket listener for roundEnd
  useEffect(() => {

    function bullshitDisplay(data) {

      setCallerName(data.callerName)
      setDieLoser(data.playerName)
      setValue(data.dice)
      setAmount(data.amount)
      setBullshitAlert(true)

      setTimeout(() => {
        setBullshitAlert(false)
      }, 5000)
      
    }
    
    socket.on('roundEnd', bullshitDisplay)

    return () => {
        socket.off('roundEnd', bullshitDisplay)
    }
    
  }, [])
    
  return (
    <>
      {bullshitAlert && 
        <div>
          <div>{callerName} called bullshit!</div>
          <div>There are {amount} {value}'s</div>
          <div>{dieLoser} will lose one die!</div>
        </div>
      }
    </>
  )
}
