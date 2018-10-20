const bw = require('./');

const project = new bw.Project(160);

const fBpm = 160;
const sBpm = fBpm / 3 * 2;

project.ramp(sBpm, fBpm, 32, 34);
project.clipLengthInBeatsAtTempo(32, sBpm);
project.close();
