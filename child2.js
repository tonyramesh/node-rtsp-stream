const child_process = require('child_process');
const mqtt = require('mqtt');
const fs = require('fs');
let cameraChildProcess = {};
async function startMqtt() {

    var connectOptions = {
        host: "192.168.106.126",
        port: 1883,
        protocol: "mqtt",
        keepalive: 10,
        clientId: 'serverUID',
        // protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 2000,
        connectTimeout: 2000,
        // key: fs.readFileSync("./key.pem"),
        // cert: fs.readFileSync("./cert.pem"),
        rejectUnauthorized: false,
    };

    var client = mqtt.connect(connectOptions);
    // Event handler for when the client is connected to the broker
    client.on('connect', () => {
        console.log('Connected to MQTT broker');

        // Subscribe to a topic
        client.subscribe('test', (err) => {
            if (!err) {
                console.log('Subscribed to topic: test');
            }
        });

        // Publish a message to a topic
        client.publish('your-topic', 'Hello from MQTT client');
    });

    // Event handler for when a message is received
    client.on('message', (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message.toString()}`);
        spawnStream(message.toString());
    });

    // Event handler for when the client is disconnected from the broker
    client.on('close', () => {
        console.log('Disconnected from MQTT broker');
    });

    // Event handler for handling errors
    client.on('error', (err) => {
        console.error('MQTT error:', err);
    });

}
process.on('SIGINT', () => {
    process.exit();
});
startMqtt();
// spawnStream(JSON.stringify(["vivo2", "admin:admin@192.168.0.87:1935"]));
function spawnStream(topicMessage) {
    topicMessage = JSON.parse(topicMessage);
    let spawnOptions = [
        "-rtsp_transport",
        "tcp",
        "-re",
        "-i",
        "rtsp://" + topicMessage[1],
        "-vcodec",
        "copy",
        "-f",
        "flv",
        `rtmp://192.168.106.126:1935/edge1/${topicMessage[0]}.flv`,
    ];
    console.log('spawnOptions', spawnOptions);
    let stream = child_process.spawn("ffmpeg", spawnOptions, {
        detached: false
    });
    // cameraChildProcess[topicMessage[0]] = stream;
    // this.inputStreamStarted = true
    stream.stdout.on('data', (data) => {
        console.log(data);
    })
    stream.stderr.on('data', (data) => {
        console.log(data);
    })
    stream.on('exit', (code, signal) => {
        if (code === 1) {
            console.error('RTSP stream exited with error', signal)
        }
    })
}