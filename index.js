const create = require('./messages/create.js');
const set = require('./messages/set.js');
const BitwigIO = require('./classes/BitwigIO');
const ramp = require('./tempo-ramp.js');
const Rhythm = require('./classes/Rhythm');
const ChordProgression = require('./classes/ChordProgression');

module.exports = {
  BitwigIO,
  Rhythm,
  ChordProgression,
  ramp,
  create,
  set,
};
