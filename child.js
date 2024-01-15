const child_process = require('child_process');


this.spawnOptions = [
    "-rtsp_transport",
    "tcp ",
    "-re",
    "-i",
    "",
    "-c",
    "copy",
    "-f",
    "flv",
    "",
]

this.stream = child_process.spawn("ffmpeg", this.spawnOptions, {
    detached: false
})
this.inputStreamStarted = true
this.stream.stdout.on('data', (data) => {
    console.log(data);
})
this.stream.stderr.on('data', (data) => {
    console.log(data);

})
this.stream.on('exit', (code, signal) => {
    if (code === 1) {
        console.error('RTSP stream exited with error', signal)
    }
})