import React, { useCallback } from 'react'
import { toast } from 'react-toastify'
import '../styles/winPage/endButtonStyles.css'
import socket from '../socketConfig'

const options = {
    REMATCH: 0,
    END: 1
}

export function EndButtons({gameName, players, playerName}) {

  const handleClick = useCallback(option => {
    if(playerName !== players[0]) {
        toast.warn('Only the host can end or rematch')
        return
    }
    if(option === options.REMATCH) socket.emit('rematch', gameName)
    if(option === options.END) socket.emit('end', gameName)
  }, [players])
    
  return (
    <div className='endButtons'>
      <button className='endBtn'
        onClick={() => handleClick(options.REMATCH)}
      >
        Rematch
      </button>
      <button className='endBtn'
        onClick={() => handleClick(options.END)}
      >
        End Game
      </button>
    </div>
  )
}