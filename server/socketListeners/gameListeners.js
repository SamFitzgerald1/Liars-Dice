module.exports = (socket, io) => {
    socket.on('joinGame', data => {
        socket.join(data)
        console.log('joined')
    })

    socket.on('endTurn', data => {
        //socket.to(data).emit('startTurn', players[(players.indexOf(socket.id) + 1) % players.length])
    })

    socket.on('getPlayers', data => {
        const playersArr = []
        const playersSet = io.sockets.adapter.rooms.get(data)
        const iterator = playersSet.values()
        for (const entry of iterator) playersArr.push(entry)
    })
}
