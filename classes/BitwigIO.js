const EventEmitter = require('events');
const _ = require('underscore');
const osc = require('osc');

/**
 * Send messages to bitwitg.
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
    this.ready = false;

    // handlers for UDP events
    this.port.on('ready', () => {
      this.ready = true;
      while (this.queue.length) {
        const args = this.queue.shift();
        this.send.apply(this, args);
      }
      this.emit('ready');
      this.emit('empty');
    });

    this.port.on('error', (e) => {
      this.error = e;
      this.emit('error', new Error('BitwigIO UDP Error: ' + e));
    });

    this.port.on('message', (m, timeTag, info) => {
      this.emit('message', m, timeTag, info);
    });
  }

  /**
   * Send arguments to bitwig. Proxys osc.UDPPort.send, except messages will be
   * queued until the port is ready. This allows us to use the send command as
   * soon the instance is created with `new BitwigIO`.
   */
  send() {
    if (!this.ready) {
      this.queue.push(arguments)
    } else {
      this.port.send.apply(this.port, arguments);
    }
  }

  /**
   * Wait for the queue to empty (or an error), pause so in flight UDP datagrams
   * finish, and then close.
   *
   * If this has received any errors, close without waiting for queue to empty.
   */
  close() {
    const close = _.once((error) => {
      setTimeout( () => {
      if (error) console.error('Closing BitwigIO with error:', error);
      this.port.close();
      }, 100);
    });

    // If we already have an error, the 'empty' message may never come. To
    // prevent us from waiting indefinitely, just close now.
    if (this.error) close(this.error);
    else if (this.ready && this.queue.length === 0) close();
    else {
      this.on('empty', close);
      this.on('error', close);
    }
  }
}

module.exports = BitwigIO;
