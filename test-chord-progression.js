const s11 = require('sharp11');
const m = require('./');
const ramp = m.ramp;
const create = m.create;
const BitwigIO = m.BitwigIO;
const set = m.set;

// s11.note.create does nut use the 'this' variable
const n = s11.note.create;

const durations = [ 3, 1 ];
const chords = [
  ['C3', 'Eb3', 'G3', 'Ab3'],
  ['D3', 'Eb3', 'F3', 'G3', 'Ab3'],
];

const cp = new m.ChordProgression(chords, durations);

// generate timing info
const rampLengths = [ 34, 35, 36, 37 ];

const BPM = 160; // project bpm
const initialBPM = 160 / 3 * 2;
const targetBPM = 160;
const staticLength = 32; // length of transition in static beats

// generate ramps
const ramps = ramp(initialBPM, targetBPM, staticLength, rampLengths);
console.log('done generatng ramps');


io = new BitwigIO();

for (var [i, r] of ramps.entries()) {
    r.rampBeatTimes.forEach((time) => {
      const note = cp.noteAt(time * BPM, i); 
      const msg = create.launcherClipNote(note.value(), 80, time * BPM, 0.25);
      io.send(msg);
    });
};

// io.send(set.launcherClipLoop(0, staticLength / initialBPM * BPM));


// quit when we are finished sending
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
