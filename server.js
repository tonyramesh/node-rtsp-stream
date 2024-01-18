const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 35500
var app = express();
let server = http.createServer(app);
var io = socketIO(server);
const cors = require('cors');
var path = require('path');
let wsServer;
STREAM_MAGIC_BYTES = "jsmp"
const ws = require('ws')
app.use("/public", express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '');
});

const filePath = './file.mp4';
const fs = require('fs');

// Create a writable stream to save the video data
const fileStream = fs.createWriteStream(filePath);
fileStream.on('finish', () => {
    console.log('Video file saved successfully!');
});
// make connection with user from server side
io.on('connection', (socket) => {
    console.log('New user connected');


    // listen for message from user
    socket.on('createMessage', (newMessage) => {
        // console.log('newMessage', newMessage);

        // fileStream.write(newMessage);
        // io.emit("video", newMessage);

        wsServer.broadcast(newMessage)
        // io.emit(/* ... */);
    });

    // when server disconnects from user
    socket.on('disconnect', () => {
        fileStream.close();
        console.log('disconnected from user');
    });
});

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/client-side.html");
// });


let pipeStreamToSocketServer = function () {
    wsServer = new ws.Server({
        port: 12000
    })
    wsServer.on("connection", (socket, request) => {
        console.log('connect');
        // return onSocketConnect(socket, request)
    })
    wsServer.broadcast = function (data, opts) {
        var results
        results = []
        for (let client of this.clients) {
            if (client.readyState === 1) {
                results.push(client.send(data, opts))
            } else {
                results.push(console.log("Error: Client from remoteAddress " + client.remoteAddress + " not connected."))
            }
        }
        return results
    }

    // return this.on('camdata', (data) => {
    //     return wsServer.broadcast(data)
    // })
}


let onSocketConnect = function (socket, request) {
    var streamHeader
    // Send magic bytes and video size to the newly connected socket
    // struct { char magic[4]; unsigned short width, height;}
    // streamHeader = new Buffer(8)
    // streamHeader.write(STREAM_MAGIC_BYTES)
    // streamHeader.writeUInt16BE(this.width, 4)
    // streamHeader.writeUInt16BE(this.height, 6)
    // socket.send(streamHeader, {
    //     binary: true
    // })
    // // console.log(`${this.name}: New WebSocket Connection (` + this.wsServer.clients.size + " total)")

    socket.remoteAddress = request.connection.remoteAddress

    return socket.on("close", (code, message) => {
        return console.log(`${this.name}: Disconnected WebSocket (` + this.wsServer.clients.size + " total)")
    })
}

pipeStreamToSocketServer();


server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
})