
Stream = require('./index');
stream = new Stream({
    name: 'name',
    // streamUrl: 'rtsp://admin:Think%123@192.168.0.250:554',
    streamUrl: '',

    // streamUrl: 'rtsp://192.168.0.250:554',
    wsPort: 9999,
    // ffmpegOptions: { // options ffmpeg flags
    //     '-stats': '', // an option with no neccessary value uses a blank string
    //     '-r': 30 // options with required values specify the value after the key
    // }
})
