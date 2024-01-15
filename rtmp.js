const NodeMediaServer = require('node-media-server');

const config = {
    logType: 3,

    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                mp4: true,
                mp4Flags: '[movflags=frag_keyframe+empty_moov]',
            }
        ]
    }
};

var nms = new NodeMediaServer(config)
nms.run();