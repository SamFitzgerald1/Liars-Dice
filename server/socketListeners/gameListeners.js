// holds dice data for different games
const gameDice = {}
// holds name of player who last guessed for different games
const lastGuesser = {}
// holds value to tell server when different games should end 
const gameEndIndicator = {}
// holds game statistics for each player
const gameStats = {}
// holds in progress games
const inProg = {}

function delGame(gameName) {
    delete gameDice[gameName]
    delete lastGuesser[gameName]
    delete gameEndIndicator[gameName]
    delete gameStats[gameName]
    delete inProg[gameName]
}

module.exports = (socket, io) => {

    // adds socket to game room
    socket.on('joinGame', async data => {
        // socket knows player-given username
        socket.playerName = data.playerName
        const tempPlayerNames = await io.in(data.gameName).fetchSockets()
        for(let i = 0; i < tempPlayerNames.length; i++)
            tempPlayerNames[i] = tempPlayerNames[i].playerName
        if(inProg[data.gameName]) socket.emit('inProg') 
        else if(tempPlayerNames.includes(data.playerName)) socket.emit('nameTaken')
        else {
            socket.join(data.gameName)
            socket.emit('joinSuccess')
        }
    })

    // sends list of socket usernames back to all players
    socket.on('getPlayers', async data => {
        const playersArr = await io.in(data).fetchSockets()
        for (let i = 0; i < playersArr.length; i++)
            playersArr[i] = playersArr[i].playerName
        
        io.in(data).emit('givePlayers', playersArr)
        // game is over when this number of players is out
        gameEndIndicator[data] = playersArr.length
    })

    socket.on('startGame', data => {
        inProg[data.gameName] = true
        gameDice[data.gameName] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0
        }
        // // game is over when this number of players is out
        // gameEndIndicator[data.gameName] = data.players.length - 1
        gameStats[data.gameName] = {}
        for(let i = 0; i < data.players.length; i++) {
            gameStats[data.gameName][data.players[i]] = {
                'correctBullshits': 0,
                'incorrectBullshits': 0,
                'incorrectGuesses': 0,
                'calzoneViolations': 0,
                'position': 0
            }
        }
        io.in(data.gameName).emit('gamePage')
    })

    // sends guess data to next player and starts their turn
    // with is first turn false
    socket.on('guess', data => {
        lastGuesser[data.gameName] = data.playerName
        io.in(data.gameName).emit('prevGuess', {prevNum: data.guessNum, prevDie: data.guessDie, guesserName: data.playerName})
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
                io.in(data.gameName).emit('roundEnd', {playerName: lastGuesser[data.gameName], callerName: socket.playerName, dice: data.prevDie, amount: gameDice[data.gameName][data.prevDie]})
                gameStats[data.gameName][socket.playerName]['correctBullshits']++
                gameStats[data.gameName][lastGuesser[data.gameName]]['incorrectGuesses']++
            } else {
                io.in(data.gameName).emit('roundEnd', {playerName: socket.playerName, callerName: socket.playerName, dice: data.prevDie, amount: gameDice[data.gameName][data.prevDie]})
                gameStats[data.gameName][socket.playerName]['incorrectBullshits']++
            }
        } else {
            if(gameDice[data.gameName][data.prevDie] + gameDice[data.gameName][1] < data.prevNum){
                io.in(data.gameName).emit('roundEnd', {playerName: lastGuesser[data.gameName], callerName: socket.playerName, dice: data.prevDie, amount: gameDice[data.gameName][data.prevDie] + gameDice[data.gameName][1]})
                gameStats[data.gameName][socket.playerName]['correctBullshits']++
                gameStats[data.gameName][lastGuesser[data.gameName]]['incorrectGuesses']++
            } else {
                io.in(data.gameName).emit('roundEnd', {playerName: socket.playerName, callerName: socket.playerName, dice: data.prevDie, amount: gameDice[data.gameName][data.prevDie] + gameDice[data.gameName][1]})
                gameStats[data.gameName][socket.playerName]['incorrectBullshits']++
            }
        }
        
        // clearing dice data
        for(key in Object.keys(gameDice[data.gameName]))
            gameDice[data.gameName][key] = 0
    })

    // removes a player from the count
    // if count is zero (only one player left in game) tell all sockets game is over
    socket.on('playerOut', data => {
        if(data.isOut) {
            gameStats[data.gameName][socket.playerName]['position'] = gameEndIndicator[data.gameName] + 1
            gameEndIndicator[data.gameName]--
        }
        if(gameEndIndicator[data.gameName] === 1) io.in(data.gameName).emit('gameEnd')
    })

    // tells all players that calzone has been called 
    socket.on('calzone', data => {
        io.in(data).emit('setCalzone', socket.playerName)
    })

    // handles round end for a calzone violation loss
    socket.on('calzoneViolation', data => {
        socket.emit('roundEnd', {playerName: socket.playerName, callerName: socket.playerName})
        gameStats[data][socket.playerName]['calzoneViolations']++
    })

    socket.on('getStats', data => {
        io.in(data).emit('giveStats', gameStats[data])
    })

    socket.on('rematch', data => {
        delGame(data)
        io.in(data).emit('lobbyPage')
    })

    socket.on('end', data => {
        delGame(data)
        io.in(data).emit('homePage')
        io.socketsLeave(data)
    })

    socket.on('disconnecting', async reason => {
        const iter = socket.rooms.values()
        iter.next()
        const gameName = iter.next().value

        const playersArr = await io.in(gameName).fetchSockets()
        for(let i = 0; i < playersArr.length; i++)
            playersArr[i] = playersArr[i].playerName
        
        console.log('socket disconnecting')

        // if room no longer exists
        if(!io.sockets.adapter.rooms.get(gameName)) {
            delGame(gameName)
            return
        }

        if(gameEndIndicator[gameName] === 0 || io.sockets.adapter.rooms.get(gameName).size === 1) {
            delGame(gameName)
            io.in(gameName).emit('homePage')
            io.socketsLeave(gameName)
        } else {
            gameEndIndicator[gameName]--
            io.in(gameName).emit('leave', socket.playerName)
        }
        
    })

}