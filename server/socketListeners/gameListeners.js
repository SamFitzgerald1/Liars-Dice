// holds dice data for different games
const gameDice = {}
// holds name of player who last guessed for different games
const lastGuesser = {}

module.exports = (socket, io) => {

    // adds socket to game room
    socket.on('joinGame', data => {
        // socket knows player-given username
        socket.playerName = data.playerName
        socket.join(data.gameName)
        console.log('player ' + socket.playerName + ' joined ' + data.gameName)
    })

    // sends list of socket usernames back to all players
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

    // sends guess data to next player and starts their turn
    // with is first turn false
    socket.on('guess', data => {
        lastGuesser[data.gameName] = data.playerName
        socket.to(data.gameName).emit('prevGuess', {prevNum: data.guessNum, prevDie: data.guessDie})
        io.in(data.gameName).emit('startTurn', {playerName: data.players[(data.players.indexOf(data.playerName) + 1) % data.players.length], isFirstTurn: false})
    })

    // starts next players turn
    // for use when players are out of the game
    // with is first turn value perserved 
    socket.on('skip', data => {
        io.in(data.gameName).emit('startTurn', {playerName: data.players[(data.players.indexOf(data.playerName) + 1) % data.players.length], isFirstTurn: data.isFirstTurn})
    })

    // starts the first turn of the round 
    // with is first turn true
    socket.on('roundStart', data => {
        io.in(data.gameName).emit('startTurn', {playerName: data.loser, isFirstTurn: true})
    })

    // puts the dice data on the gameDice object
    socket.on('diceInfo', data => {
        const diceInfo = data.diceInfo
        for(key of Object.keys(diceInfo))
            gameDice[data.gameName][diceInfo[key]]++
    })

    // handles round end
    // sends back 'roundEnd' socket event with name of losing player
    // clears dice data
    socket.on('bullshit', data => {
        // if ones are not wild
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
        
        // clearing dice data
        for(key in Object.keys(gameDice[data.gameName]))
            gameDice[data.gameName][key] = 0
    })

    // tells all players that calzone has been called 
    socket.on('calzone', data => {
        io.in(data).emit('setCalzone')
    })

    // handles round end for a calzone violation loss
    socket.on('calzoneViolation', () => {
        socket.emit('roundEnd', socket.playerName)
    })
}