const sharp11 = require('sharp11');

/**
 * Represents a looping monophonic rhythmic pattern. Actual note/instrument
 * data should be stored separately.
 *
 * Useful for chord patterns.
 */
class Rhythm {
  /**
   * @param {sharp11.duration.Duration[]|Number[]} durations - the list of durations. Values
   *        can be Number or sharp11.duration.
   */
  constructor(durations) {
    this.list = durations.map(d => {
      if (typeof d === 'number') return sharp11.duration.beats(d);
      else return d;
    }) || [];
  }

  /**
   * Calculate the total length
   * @returns {sharp11.duration.Duration}
   */
  get length () {
    return this.list
      .reduce((last, current) => last.merge(current), sharp11.duration.beats(0))
      .clean();
  }

  /**
   * If the loop has played exactly `duration` beats, what index of will be
   * active?
   * @param {Number|sharp11.duration.Duration} duration - the length in beats to inspect
   * @returns {Integer} - The index in the durations array
   */
  indexAt(duration) {
    if (typeof duration === 'number') {
      // convert numbers to sharp11.duration
      // convert negative numbers to a value between 0 and length.value()
      if (duration < 0) {
        const totalValue = this.length.value();
        const howMuch = Math.ceil((duration * -1) / totalValue);
        duration += howMuch * totalValue;
      };
      duration = sharp11.duration.beats(duration);
    }

    // If duration is greater than the total length, loop from the beginning
    const point = duration.value() % this.length.value();

    // search through the list to find the index of the point
    let start = 0;
    for (let [i, d] of this.list.entries()) {
      const value = d.value();
      const end = start + value;
      if (point >= start && point < end) return i;
      start += value;
    }
    throw new Error('Durations.indexAt failed to find the point');
  }
}

module.exports = Rhythm;
