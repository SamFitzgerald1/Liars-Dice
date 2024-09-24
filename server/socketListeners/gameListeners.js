const gameDice = {}
const lastGuesser = {}

module.exports = (socket, io) => {
    socket.on('joinGame', data => {
        socket.playerName = data.playerName
        socket.join(data.gameName)
        console.log('player ' + socket.playerName + ' joined ' + data.gameName)
    })

    socket.on('getPlayers', async data => {
        const playersArr = await io.in(data).fetchSockets()
        for (let i = 0; i < playersArr.length; i++)
            playersArr[i] = playersArr[i].playerName
        
        io.in(data).emit('givePlayers', playersArr)
    })

    socket.on('startGame', data => {
        gameDice[data] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0
        }
        io.in(data).emit('gamePage')
    })

    socket.on('guess', data => {
        lastGuesser[data.gameName] = data.playerName
        socket.to(data.gameName).emit('prevGuess', {prevNum: data.guessNum, prevDie: data.guessDie})
        io.in(data.gameName).emit('startTurn', {player: data.players[(data.players.indexOf(data.playerName) + 1) % data.players.length], isFirstTurn: false})
    })

    socket.on('skip', data => {
        io.in(data.gameName).emit('startTurn', {player: data.players[(data.players.indexOf(data.playerName) + 1) % data.players.length], isFirstTurn: data.isFirstTurn})
    })

    socket.on('roundStart', data => {
        io.in(data.gameName).emit('startTurn', {player: data.loser, isFirstTurn: true})
    })

    socket.on('diceInfo', data => {
        
        const diceInfo = data.diceInfo

        console.log(diceInfo)

        for(key of Object.keys(diceInfo))
            gameDice[data.gameName][diceInfo[key]]++

        console.log(gameDice)
    })

    socket.on('bullshit', data => {
        if(data.prevDie === 1 || data.isCalzone) {
            if(gameDice[data.gameName][data.prevDie] < data.prevNum) {
                io.in(data.gameName).emit('roundEnd', lastGuesser[data.gameName])
            } else {
                io.in(data.gameName).emit('roundEnd', socket.playerName)
            }
        } else {
            if(gameDice[data.gameName][data.prevDie] + gameDice[data.gameName][1] < data.prevNum){
                io.in(data.gameName).emit('roundEnd', lastGuesser[data.gameName])
            } else {
                io.in(data.gameName).emit('roundEnd', socket.playerName)
            }
        }

        for(key in Object.keys(gameDice[data.gameName]))
            gameDice[data.gameName][key] = 0

        console.log(gameDice)
        
    })

    socket.on('calzoneViolation', () => {
        socket.emit('roundEnd', socket.playerName)
    })
}