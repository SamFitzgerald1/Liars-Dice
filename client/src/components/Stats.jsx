import React, { useCallback, useEffect, useState } from 'react'
import socket from '../socketConfig'

export function Stats({gameName, players}) {

  const [stats, setStats] = useState({})

  useEffect(() => {
    socket.emit('getStats', gameName)
  }, [])

  // socket listener for giveStats
  useEffect(() => {

    function statsSet(data) {
      setStats(data)
    }

    socket.on('giveStats', statsSet)

    return () => {
      socket.off('giveStats', statsSet)
    }
    
  }, [])
  
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Players</td>
            <td>Correct Bullshit Calls</td>
            <td>Incorrect Bullshit Calls</td>
            <td>Incorrect Guesses</td>
            <td>Calzone Violations</td>
            <td>Position</td>
          </tr>
          {Object.keys(stats).map(name => {
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{stats[name]['correctBullshits']}</td>
                <td>{stats[name]['incorrectBullshits']}</td>
                <td>{stats[name]['incorrectGuesses']}</td>
                <td>{stats[name]['calzoneViolations']}</td>
                <td>{stats[name]['position']}</td>
              </tr>
            )
          })}
        </tbody>       
      </table>
    </>
  )
}