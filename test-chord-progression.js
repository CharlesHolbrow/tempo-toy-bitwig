const s11 = require('sharp11');
const m = require('.');
const ramp = m.ramp;
const create = m.create;
const BitwigIO = m.BitwigIO;
const set = m.set;

const io = new BitwigIO();

const durations = [ 3, 1, 3, 1 ];
const chords = [
  ['C3', 'Eb3', 'G3', 'Ab3'],
  ['D3', 'Eb3', 'F3', 'G3', 'Ab3'],
];

const c2 = [
  ['C4', 'Eb4', 'F4', 'Bb4', 'c5'],
  ['C4', 'Db4', 'F4', 'Gb4', 'Bb4'],
  ['Bb3', 'C4', 'F4', 'G4', 'Bb4'],
  ['G3', 'Bb3', 'D4', 'F4', 'Gb4']
];

const cp = new m.ChordProgression(c2, durations);
const LEN = 48;

c2.forEach((notes, i) => {
  for (let note of notes) {
    const midiNote = s11.note.create(note).value();
    const msg = create.launcherClipNote(midiNote,100, i*(LEN + LEN/3), LEN);
    io.send(msg);
  }
});

io.send(set.launcherClipLoop(0, c2[0].length * LEN));


// quit when we are finished sending
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
