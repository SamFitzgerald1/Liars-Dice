module.exports = (socket, io) => {
    socket.on('joinGame', data => {
        socket.playerName = data.playerName
        socket.join(data.gameName)
        console.log('joined ' + data.gameName)
    })

    socket.on('endTurn', data => {
        //socket.to(data).emit('startTurn', players[(players.indexOf(socket.id) + 1) % players.length])
    })

    socket.on('getPlayers', async data => {
        const playersArr = await io.in(data).fetchSockets()
        for (let i = 0; i < playersArr.length; i++)
            playersArr[i] = playersArr[i].playerName
        
        socket.emit('givePlayers', playersArr)
        socket.to(data).emit('givePlayers', playersArr)
    })
}
