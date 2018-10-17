const _ = require('underscore');
const ramp = require('./tempo-ramp.js');
const create = require('./messages-create.js');
const set = require('./messages-set.js');
const BitwigIO = require('./BitwigIO.js');

const io = new BitwigIO;

// generate timing info
const rampLengths = [ 34, 35, 36, 37 ];
const notes =       [ 48, 51, 55, 56 ];

const BPM = 160; // project bpm
const initialBPM = 160 / 3 * 2;
const targetBPM = 160;
const staticLength = 32; // length of transition in static beats

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

// ramps[0].staticBeatTimes.forEach((time) => {
//     const msg = create.launcherClipNote(39, 100, time * BPM, 0.25);
//     io.send(msg);
// });

io.send(set.launcherClipLoop(0, staticLength / initialBPM * BPM));


// quit when we are finished sending
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
