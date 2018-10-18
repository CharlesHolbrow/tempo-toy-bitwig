const s11 = require('sharp11');

const p = require('./');
const create = p.create;

/**
 * @param {String} chordName - Name the chord
 * @param {Number} [octave=4] - Optional octave
 * @returns {Number[]} - Midi note numbers
 */
const chordNameToMidi = function(chordName, octave) {
if (typeof octave !== 'number') octave = 4;
  return s11.chord.create(chordName, octave).chord.map(note => {
    return note.value();
  });
};

const chordNames = ['Em', 'C', 'G', 'D'];
const durations = [
  s11.duration.beats(3),
  s11.duration.beats(1),
];

// save the results here
const msgs = [];

chordNames.forEach((chord, index) => {
  const midiNotes = chordNameToMidi(chord);
  midiNotes.forEach((noteNumber) => {
    msgs.push(create.launcherClipNote(noteNumber, 100, index * 4, 4));
  });
  console.log(chord, index);
});

// Send to bitwig
const io = new p.BitwigIO();
// quit when we are finished sending
io.on('empty', () => { setTimeout(() => { process.exit() }, 100 ); });
// send them 
msgs.forEach(msg => {io.send(msg)});
