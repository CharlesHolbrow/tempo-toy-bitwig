const BitwigIO = require('./BitwigIO');
const create = require('../messages/create');
const set = require('../messages/set');
const util = require('../utilities');

class Project {
  constructor(BPM) {
    if (!BPM) throw new Error('Project constructor needs a project BPM');

    this.io = new BitwigIO();
    this.BPM = BPM;
  }

  /**
   * @param {Number} initialBpm - initial tempo in beats-per-minute
   * @param {Number} finalBpm - tempo to accelerate or decelerate to
   * @param {Number} durationInBeatsAtInitialTempo - How long should the
   *        transition last, measure in beats at the initial tempo.
   * @param {Number|Number[]} beatsInChangingTempo - how many beats in the
   *        changing tempo. If this is an array, return an array of ramps.
   * @param {Number} [resolution] - The equation is not solved for exact beat
   *        locations, so we evaluate it at a fixed interval to find the beats.
   */
  ramp(initialBpm, finalBpm, durationInBeatsAtInitialTempo, beatsInChangingTempo, resolution) {
    const r = util.ramp(initialBpm, finalBpm, durationInBeatsAtInitialTempo, beatsInChangingTempo, resolution);
    const noteLengthInBeats = 0.25;
    const note = 48;
    const velocity = 65;

    for (let t of r.rampBeatTimes) {
      const msg = create.launcherClipNote(note, velocity, t * this.BPM, noteLengthInBeats);
      this.io.send(msg);
    }
  }

  clipLengthInBeatsAtTempo(beats, tempo) {
    tempo = typeof tempo === 'number' ? tempo : this.BPM;
    const timeInMinutes = beats / tempo;

    // How many beats at the project bpm? Round to nearest beat if very close.
    const pBpm = this.BPM * timeInMinutes;
    const pBpmRound = Math.round(pBpm);
    const delta = Math.abs(pBpm - pBpmRound);
    const useBpm = delta < 0.00005 ? pBpmRound : pBpm

    const msg = set.launcherClipLoop(0, useBpm);
    this.io.send(msg);
  }

  close() {
    this.io.close()
  }
}

module.exports = Project;
