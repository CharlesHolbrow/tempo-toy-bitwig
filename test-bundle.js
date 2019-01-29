const bw = require('./');

const io = new bw.BitwigIO();
const osc = require('osc');
const m1 = bw.create.launcherClip(1, 1, 'hi21', false);
const m2 = bw.create.launcherClipNote(0, 100, 0, 2);

// io.send(m1);
// io.send(m2);

io.send({
  timeTag: osc.timeTag(0),
  packets: [],
});

setTimeout(() => io.close(), 3000)

// bundles crash bitwig 2.4.2
