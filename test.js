const _ = require('underscore');
const ramp = require('./tempo-ramp.js');
const create = require('./messages-create.js');
const set = require('./messages-set.js');
const BitwigIO = require('./BitwigIO.js');

const io = new BitwigIO;

// generate timing info
const rampLengths = [ 85, 84, 83, 82, 81, 80 ];
const notes =       [ 47, 50, 54, 57, 60, 64 ];

const BPM = 110; // project bpm
const initialBPM = 90;
const targetBPM = 135;
const staticLength = 64; // length of transition in static beats

// generate ramps
const ramps = ramp(initialBPM, targetBPM, staticLength, rampLengths);
console.log('done generatng ramps');

_.zip(ramps, notes).forEach((r) => {
    const [ramp, note] = r;
    ramp.rampBeatTimes.forEach((time) => {
        const msg = create.launcherClipNote(note, 80, time * BPM, 0.25);
        io.send(msg);
    });
});

ramps[0].staticBeatTimes.forEach((time) => {
    const msg = create.launcherClipNote(39, 100, time * BPM, 0.25);
    io.send(msg);
});

io.send(set.launcherClipLoop(0, staticLength / initialBPM * BPM));


// quit when we are finished sending
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
