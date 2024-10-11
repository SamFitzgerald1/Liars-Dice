import React, { useEffect, useState } from 'react'
import socket from '../socketConfig'

export function Stats({gameName, players}) {

  const [stats, setStats] = useState({})

  useEffect(() => {
    socket.emit('getStats', gameName)
  }, [])

  useEffect(() => {
    function statsSet(data) {
      console.log('data')
      console.log(data)
      setStats(data)
    }

    socket.on('giveStats', statsSet)

    return () => {
      socket.off('giveStats', statsSet)
    }
  }, [])

  const show = () => {
    Object.keys(stats[players[0]]).forEach(key => {console.log(stats[players[0]][key])})
  }
  
  return (
    <>
      <button onClick={show}>show</button>
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