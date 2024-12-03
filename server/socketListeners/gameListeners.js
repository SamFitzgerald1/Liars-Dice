// holds dice data for different games
const gameDice = {}
// holds name of player who last guessed for different games
const lastGuesser = {}
// holds value to tell server when different games should end 
const gameEndIndicator = {}
// holds game statistics for each player
const gameStats = {}

module.exports = (socket, io) => {

    // adds socket to game room
    socket.on('joinGame', data => {
        // socket knows player-given username
        socket.playerName = data.playerName
        socket.join(data.gameName)
        // gameStats[data.gameName][socket.playerName] = {
        //     correctBullshits: 0,
        //     incorrectBullshits: 0,
        //     incorrectGuesses: 0,
        //     calzoneViolations: 0,
        //     position: 0
        // }
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
        gameDice[data.gameName] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0
        }
        // game is over when this number of players is out
        gameEndIndicator[data.gameName] = data.players.length - 1
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
        socket.to(data.gameName).emit('prevGuess', {prevNum: data.guessNum, prevDie: data.guessDie, guesserName: data.playerName})
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
        if(gameEndIndicator[data.gameName] === 0) io.in(data.gameName).emit('gameEnd')
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
        delete gameDice[data]
        delete lastGuesser[data]
        delete gameEndIndicator[data]
        delete gameStats[data]
        io.in(data).emit('lobbyPage')
    })

    socket.on('end', data => {
        delete gameDice[data]
        delete lastGuesser[data]
        delete gameEndIndicator[data]
        delete gameStats[data]
        io.in(data).emit('homePage')
        io.socketsLeave(data)
    })

    socket.on('disconnecting', data => {
        const iter = socket.rooms.values()
        iter.next()
        const gameName = iter.next().value

        // use gameName to check if: 
        // 1. game is ongoing or over
        // 2. if over delete all related data
        // 3. if game ongoing remove player from game 
        //    3a) includes removing from turn order and players component
        //    3b) restart the round without removing anyones dice
        // 4. if the room is ever empty upon a person leaving, delete all related data (note: do this check first probably)
    })

}