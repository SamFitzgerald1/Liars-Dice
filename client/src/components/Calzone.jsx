import React from 'react'

export function Calzone({setIsCalzone, isMyTurn, isFirstTurn, hasCalzoned, setHasCalzoned}) {

    const calzone = () => {

      if(!isMyTurn || !isFirstTurn || hasCalzoned) return
      setIsCalzone(true)
      setHasCalzoned(true)
    }
    
  return (
    <>
      <button onClick={calzone}>Calzone!</button>
    </>
  )
}