import React, { useEffect, useState } from 'react'
import socket from '../socketConfig'

export function ShowCalzone({callerName, setCallerName}) {

  const [calzoneAlert, setCalzoneAlert] = useState(false)

  // socket listener for setCalzone
  useEffect(() => {

    function calzoneAlertSet(data) {

      setCallerName(data)
      
      setCalzoneAlert(true)

      setTimeout(() => {
        setCalzoneAlert(false)
      }, 5000)

    }

    socket.on('setCalzone', calzoneAlertSet)

    return () => {
        socket.off('setCalzone', calzoneAlertSet)
    }
    
  }, [])
    
  return (
    <>
      {calzoneAlert && <div>{callerName} called calzone!</div>}
    </>
  )
}
