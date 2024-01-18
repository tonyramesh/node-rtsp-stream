var child = require('child_process');
var spawn = child.spawn;
var config = {
    port: 8000,
    url: ''
}
const { io } = require("socket.io-client");

const socket = io("http://192.168.106.90:8001");

//ffmpeg
console.log('Starting FFMPEG')
var ffmpegString = '-i ' + config.url + ' -c:v copy -an -f flv -preset superfast -tune zerolatency -'
// var ffmpegString = '-i ' + config.url + ' -c:v copy -an -f flv -preset superfast -tune zerolatency -'
//var ffmpegString = '-i '+config.url+' -c:v libx264 -preset superfast -tune zerolatency -c:a aac -ar 44100 -f flv pipe:4'
//ffmpegString += ' -f mpegts -c:v mpeg1video -an http://localhost:'+config.port+'/streamIn/2'
if (ffmpegString.indexOf('rtsp://') > -1) {
    ffmpegString = '-rtsp_transport tcp ' + ffmpegString
}
console.log('Executing : ffmpeg ' + ffmpegString)
var ffmpeg = spawn('ffmpeg', ffmpegString.split(' '), {
    detached: false
});
ffmpeg.on('close', function (buffer) {
    console.log('ffmpeg died')
})
ffmpeg.stdout.on('data', (buffer) => {
    socket.emit('createMessage', buffer);
})

ffmpeg.stderr.on('data', (data) => {
    global.process.stderr.write(data)
})
//data from pipe:1 output of ffmpeg
// ffmpeg.stdio[1].on('data', function (buffer) {
//     // console.log('data', buffer);
//     // socket.emit('createMessage', buffer);
// });