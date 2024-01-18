var events = require('events');
var express = require('express')
var app = express();
var server = require('http').Server(app);
const socketIO = require('socket.io');
var Emitters = {}
var firstChunks = {}
var config = {
    port: 8001,
    url: ''
}
var initEmitter = function (feed) {
    if (!Emitters[feed]) {
        Emitters[feed] = new events.EventEmitter().setMaxListeners(0)
    }
    return Emitters[feed]
}
//hold first chunk of FLV video
var initFirstChunk = function (feed, firstBuffer) {
    if (!firstChunks[feed]) {
        firstChunks[feed] = firstBuffer
    }
    return firstChunks[feed]
}
console.log('Starting Express Web Server on Port ' + config.port)
//start webserver
server.listen(config.port);

//make libraries static
app.use('/libs', express.static(__dirname + '/../../web/libs'));
app.use('/', express.static(__dirname + '/'));

//homepage with video element.
//static file send of index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

//// FLV over HTTP, this URL goes in the flv.js javascript player
// see ./index.html
app.get(['/flv', '/flv/:feed/s.flv'], function (req, res) {
    //default to first feed
    if (!req.params.feed) { req.params.feed = '1' }
    //get emitter
    req.Emitter = initEmitter(req.params.feed)
    //variable name of contentWriter
    var contentWriter
    //set headers
    res.setHeader('Content-Type', 'video/x-flv');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //write first frame on stream
    res.write(initFirstChunk(1))
    //write new frames as they happen
    req.Emitter.on('data', contentWriter = function (buffer) {
        // console.log('data');
        res.write(buffer)
    })
    //remove contentWriter when client leaves
    res.on('close', function () {
        req.Emitter.removeListener('data', contentWriter)
    })
});


var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', (buffer) => {
        console.log('newMessage', buffer);
        initFirstChunk(1, buffer)
        initEmitter(1).emit('data', buffer)

    });

    // when server disconnects from user
    socket.on('disconnect', () => {
        console.log('disconnected from user');

    });
});
