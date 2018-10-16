const _ = require('underscore');
const ramp = require('./tempo-ramp.js');
const create = require('./create-messages.js');
const BitwigIO = require('./BitwigIO.js');

const io = new BitwigIO;

// generate timing info
const rampLengths = [ 85, 84, 83, 82, 81, 80 ];
const notes =      [ 47, 50, 54, 57, 60, 64 ];

// generate ramps
const ramps = ramp(90, 135, 64, rampLengths);
console.log('done generatng ramps')

_.zip(ramps, notes).forEach((r) => {
    const [ramp, note] = r;
    ramp.rampBeatTimes.forEach((time) => {
        const beats = time * 60;
        const msg = create.launcherClipNote(note, 80, beats, 0.25);
        io.send(msg);
    });
});

ramps[0].staticBeatTimes.forEach((time) => {
    msg = create.launcherClipNote(39, 100, time * 60, 0.25);
    io.send(msg);
});

// quit when we are finished sending
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
