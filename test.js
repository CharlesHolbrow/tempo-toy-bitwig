const _ = require('underscore');
const util = require('./utilities.js');
const create = require('./messages/create.js');
const set = require('./messages/set.js');
const BitwigIO = require('./classes/BitwigIO.js');

const io = new BitwigIO;

// generate timing info
const rampLengths = [ 31, 32, 33, 34 ];
const notes =       [ 48, 51, 55, 56 ];

const BPM = 160; // project bpm
const initialBPM = 160 / 3 * 2;
const targetBPM = 160;
const staticLength = 32; // length of transition in static beats

// generate ramps
const ramps = rampLengths.map((rLength, i)=> {
    return util.ramp(initialBPM, targetBPM, staticLength, rLength + ((i + 1) * 0.25));
});

_.zip(ramps, notes).forEach((r, i) => {

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

io.close()

