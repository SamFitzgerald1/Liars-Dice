import React, { useCallback, useEffect } from 'react'
import socket from '../socketConfig'

export function Calzone({gameName, setIsCalzone, isMyTurn, isFirstTurn, hasCalzoned, setHasCalzoned, oneDie}) {

  // for socket listener 'setCalzone'
  useEffect(() => {

    function calzoneSet() {
      setIsCalzone(true)
    }

    socket.on('setCalzone', calzoneSet)

    return () => {
      socket.off('setCalzone', calzoneSet)
    }
    
  }, [])
  
  const calzone = useCallback(() => {

    // check if calzone call is allowed
    if(!isMyTurn || !isFirstTurn || hasCalzoned || !oneDie) return

    socket.emit('calzone', gameName)

    setHasCalzoned(true)

  }, [isMyTurn, isFirstTurn, hasCalzoned])
    
  return (
    <div className='calzone'>
      <button className='gameBtn'
        onClick={calzone}>
          Calzone!
      </button>
    </div>
  )
}