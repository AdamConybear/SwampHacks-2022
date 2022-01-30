const express = require("express")
const app = express()  // this variable calls function to start express server
const server = require('http').Server(app) // allows us to create a server to be used with socket IO
// const io = require('socket.io')(server) // passes server created in line above into return value of require statement... lets io know what server to use
const {v4 : uuidV4 } = require("uuid") // save reference to "v4" function from uuid library, but rename function to "uuidV4"
const path = require('path')
const bodyParser = require('body-parser')

const port = 7777 // port defaulted to when none is provided by the environment

app.use(express.static('./client/build'))
app.use(bodyParser.json())

// The root endpoint is the entry point to react game frontend
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
})

// This is called anytime somebody connects to our server.
// io.on('connection', socket => {
//     // Below are listeners that will be triggered by different user events.
//     socket.on('join-room', (room_id, user_id) => {
//         console.log("room joined")
//         socket.join(room_id) // tells socket to join a room with current user and provided room_id
//         io.emit('user-connected', user_id) // sends a message to everyone in this room with user_id of new user
//     })
// })

function start_server() {
    server.listen(process.env.PORT || port, () => console.log(`Server listening at http://localhost:${port}`))
}

start_server()