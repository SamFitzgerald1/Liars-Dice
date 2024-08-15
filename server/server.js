const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const gameSocket = require('./socketListeners/gameListeners')

app.use(cors({
    origin: 'http://localhost:5173'
}))

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})

io.on('connection', socket => {
    console.log('socket connected')

    gameSocket(socket, io)
})

server.listen(3000, () => {
    console.log('server on')
})