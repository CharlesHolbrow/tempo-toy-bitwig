const osc = require('osc');

/**
 * Returns a `create-note` message. Sending this message to bitwig will create
 * a note in the currently selected launcher clip.
 * @param {Integer} midiNoteNumber
 * @param {Integer} midiVelocity
 * @param {Float} startBeat - start time in beats
 * @param {Float} durationBeat - duration in beats
 */
const createNoteMessage = function(midiNoteNumber, midiVelocity, startBeat, durationBeat) {
    return {
        address: '/launcher/selected-clip/create-note',
        args: [
            {
                type: 'i',
                value: midiNoteNumber % 128,
            },{
                type: 'i',
                value: midiVelocity % 128,
            },{
                type: 'f',
                value: startBeat,
            },{
                type: 'f',
                value: durationBeat,
            },
        ],
    }
}

const io = new osc.UDPPort({
    metadata: true,
    // localAddress: "127.0.0.1",
    // localPort: 9001,
    remoteAddress: "127.0.0.1",
    remotePort: 9000,
});

let i = 0;

const send = () => {
    const msg = createNoteMessage(0, 100, 1.25, 1.75);
    io.send(msg, '127.0.0.1', 9000);
    i++;
};

io.on('ready', () => {
    console.log('ready');
    send();
    setTimeout(() => {
        process.exit();
    }, 100);
});

io.open();
