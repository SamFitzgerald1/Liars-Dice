import React from 'react'
import { Stats } from '../components/Stats'

export function Win({gameName, players}) {
  return (
    <>
      You Win!!!
      <Stats gameName={gameName} players={players} />
    </>
  )
}