let players = []

module.exports = socket => {
    socket.on('joinGame', data => {
        socket.join(data)
        console.log('joined')
        players = [...players, socket.id]
    })

    socket.on('endTurn', data => {
        socket.to(data).emit('startTurn', players[(players.indexOf(socket.id) + 1) % players.length])
    })
}
