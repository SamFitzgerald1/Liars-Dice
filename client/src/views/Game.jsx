import React, {useState, useEffect} from 'react'
import socket from '../socketConfig'
import { DiceBox } from '../components/DiceBox'

export function Game({gameName}) {
    
    const [isMyTurn, setIsMyTurn] = useState(false)
  
    useEffect(() => {
      socket.on('startTurn', data => {
        if(data === socket.id) setIsMyTurn(true)
      })
    }, [socket])
  
    const turn = () => {
      if(isMyTurn) {
        console.log('Action')
        setIsMyTurn(false)
        socket.emit('endTurn', gameName)
      }
    }
  
    const start = () => {
      setIsMyTurn(true)
    }
  
  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={turn}>Action!</button>
      <DiceBox />
    </>
  )
}
