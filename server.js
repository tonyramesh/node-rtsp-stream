const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 3000
var app = express();
let server = http.createServer(app);
var io = socketIO(server);
const cors = require('cors');
var path = require('path');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '');
});

// make connection with user from server side
io.on('connection', (socket) => {
    console.log('New user connected');


    // listen for message from user
    socket.on('createMessage', (newMessage) => {
        console.log('newMessage', newMessage);
        io.emit("video", newMessage);
        // io.emit(/* ... */);
    });

    // when server disconnects from user
    socket.on('disconnect', () => {
        console.log('disconnected from user');
    });
});

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/client-side.html");
// });


server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});