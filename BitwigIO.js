const EventEmitter = require('events');
const osc = require('osc');
/**
 * Send messages to bitwitg. We can begin sending as soon as created
 * @fires #message message received
 * @fires #ready
 * @fires #empty fired when the queue has been emptied
 */
class BitwigIO extends EventEmitter {
    constructor() {
        super();
        this.port = new osc.UDPPort({
            metadata: true,
            remoteAddress: "127.0.0.1",
            remotePort: 48888,
            // localAddress: "127.0.0.1",
            // localPort: 48889,
        });
        this.port.open();

        // messages sent before we are ready should be saved here
        this.queue = [];
        // messages are
        this.ready = false;

        // handlers for UDP events
        this.port.on('ready', () =>{
            this.ready = true;
            while (this.queue.length) {
                const args = this.queue.shift();
                this.send.apply(this, args);
            }
            this.emit('ready');
        });

        this.port.on('error', (e) => {
            this.ready = false;
            throw new Error('OSC UDP Error: ' + e);
        });

        this.port.on('message', (m, timeTag, info) => {
            this.emit('message', m, timeTag, info);
        });
    }

    send() {
        if (!this.ready) {
            this.queue.push(arguments)
        } else {
            this.port.send.apply(this.port, arguments);
            if (this.queue.length === 0) this.emit('empty');
        }
    }
}

module.exports = BitwigIO;
