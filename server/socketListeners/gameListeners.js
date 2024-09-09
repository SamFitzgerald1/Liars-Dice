module.exports = (socket, io) => {
    socket.on('joinGame', data => {
        socket.playerName = data.playerName
        socket.join(data.gameName)
        console.log('joined ' + data.gameName)
    })

    socket.on('getPlayers', async data => {
        const playersArr = await io.in(data).fetchSockets()
        for (let i = 0; i < playersArr.length; i++)
            playersArr[i] = playersArr[i].playerName
        
        io.in(data).emit('givePlayers', playersArr)
    })

    socket.on('startGame', data => {
        socket.to(data).emit('gamePage')
    })

    socket.on('endTurn', data => {
        socket.to(data.gameName).emit('startTurn', data.players[(data.players.indexOf(data.playerName) + 1) % data.players.length])
    })

    socket.on('guess', data => {
        console.log(data.gameName)
        socket.to(data.gameName).emit('prevGuess', {prevNum: data.guessNum, prevDie: data.guessDie})
    })
}

    
