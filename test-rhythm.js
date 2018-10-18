const s11 = require('sharp11');
const Rhythm = require('./Rhythm.js');

const chordNames = ['Em', 'C', 'G', 'D'];
const durations = [
  s11.duration.beats(3),
  s11.duration.beats(1),
];

const ds = new Rhythm(durations);

function assert(reason, bool) {
  if (!bool) throw new Error(reason);
}

assert('Duration.indexAt(0) result', ds.indexAt(0) === 0);
assert('Duration.indexAt(2.5) result', ds.indexAt(0) === 0);
assert('Duration.indexAt(3) result', ds.indexAt(3) === 1);
assert('Duration.indexAt(4) result', ds.indexAt(4) === 0);
assert('Duration.indexAt(6.5) result', ds.indexAt(6.5) === 0);
assert('Duration.indexAt(7) result', ds.indexAt(7) === 1);
assert('Duration.indexAt(-1) result', ds.indexAt(-1) === 1);
assert('Duration.indexAt(-3.9) result', ds.indexAt(-3.9) === 0);


