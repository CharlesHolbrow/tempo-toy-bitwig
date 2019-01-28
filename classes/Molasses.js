const process = require('process');

/**
 * Molasses wraps a function, and creates a single file queue of calls to that
 * function. Calling push schedules a call in the future, and guarantees that
 * no future calls will happen until too quickly
 */
class Molasses {
  constructor(handlerFunc) {
    this.handler = handlerFunc;
    this.queue = [];
    this.nextCallAllowedAt = 0; // in ms
  }

  /**
   * Schedule a function to be called
   * @param {any[]} args - the args to apply to the handler function
   * @param {Number} [delay=1] - this call to wait before allowing another call
   */
  push(args, delay) {
    if (typeof delay !== 'number') delay = 1;
    this.queue.push({delay, args});

    // if playing is already scheduled by a previous call to push, we are done.
    if (this.queue.length !== 1) return; 

    const wait = (this.nextCallAllowedAt) - this.now();
    if (wait <= 0) {
      // we can call the handler immediately
      this._call();
    } else {
      // we need to wait to call the handler
      setTimeout(() => {
        this._call();
      }, wait);
    }
  }

  // this should never be called from client code
  _call() {
    const { args, delay } = this.queue.shift();
    this.nextCallAllowedAt = this.now() + delay;
    this.handler.apply(null, args);
    // if there is another object in the queue, schedule it
    if (this.queue.length) {
      setTimeout(() =>{
        this._call();
      }, delay);
    }
  }

  /**
   * @returns {Number} - uptime in seconds
   */
  now() {
    return process.uptime() * 1000;
  }
}

module.exports = Molasses;
