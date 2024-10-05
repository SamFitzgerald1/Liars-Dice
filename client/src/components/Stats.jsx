import React from 'react'

export function Stats({players}) {
  return (
    <table>
        <tr>
            <td>Players</td>
            {players.map(player => <td key={player}>{player}</td>)}
        </tr>
        <tr>
            <td>good bullshit</td>
            {/* in order of players access corresponding data in an object sent from the server */}
        </tr>
    </table>
  )
}