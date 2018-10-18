const create = require('./messages/create.js');
const BitwigIO = require('./classes/BitwigIO.js');

const io = new BitwigIO;

io.send(create.launcherClip(1, 1, 'tester2'));

// quit when we are finished
io.on('empty', () => {
    setTimeout(() => { process.exit()}, 100 );
});
