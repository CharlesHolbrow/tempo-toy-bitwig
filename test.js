const osc = require('osc');
const ramp = require('./tempo-ramp.js');
const create = require('./create-messages.js');

// generate timing info
const r1 = ramp(60, 70, 6, 7);
const r2 = ramp(60, 70, 6, 8);
const r3 = ramp(60, 70, 6, 9);

const io = new osc.UDPPort({
    metadata: true,
    // localAddress: "127.0.0.1",
    // localPort: 9001,
    remoteAddress: "127.0.0.1",
    remotePort: 9000,
});

io.on('ready', () => {
    console.log('ready!!');
    r1.rampBeatTimes.forEach(time => {
        const beats = time * 60;
        const msg = create.launcherClipNote(60, 120, beats, 0.2);
        io.send(msg);
    });
    r1.staticBeatTimes.forEach(time => {
        const beats = time * 60;
        const msg = create.launcherClipNote(62, 100, beats, 0.2);
        io.send(msg);
    });
    r2.rampBeatTimes.forEach(time => {
        const beats = time * 60;
        const msg = create.launcherClipNote(58, 120, beats, 0.2);
        io.send(msg);
    });
    r3.rampBeatTimes.forEach(time => {
        const beats = time * 60;
        const msg = create.launcherClipNote(56, 120, beats, 0.2);
        io.send(msg);
    });
    setTimeout(() => {
        process.exit()
    }, 3000);
});

io.on('error', (e) => {
    console.error('osc io error:', e);
});

io.open();
