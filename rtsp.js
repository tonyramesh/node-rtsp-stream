const RtspServer = require('rtsp-streaming-server').default;
const server = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000
});


async function run() {
    try {
        await server.start();
    } catch (e) {
        console.error(e);
    }
}

run();

// ffmpeg -i world.mp4 -c:v copy -f rtsp rtsp://127.0.0.1:5554/stream1