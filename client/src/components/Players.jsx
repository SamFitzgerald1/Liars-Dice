import React from 'react'

export function Players({players}) {
  return (
    <>
      <h1>Players</h1>
      {players.map(player => <p key={player}>{player}</p>)}
    </>
  )
}