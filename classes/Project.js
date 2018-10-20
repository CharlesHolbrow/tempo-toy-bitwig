const _ = require('underscore');
const s11 = require('sharp11');

const BitwigIO = require('./BitwigIO');
const create = require('../messages/create');
const set = require('../messages/set');
const util = require('../utilities');

class Project {
  constructor(BPM) {
    if (!BPM) throw new Error('Project constructor needs a project BPM');

    this.io = new BitwigIO();
    this.BPM = BPM;

    // When ramping, the tempo to we start and end at, expressed as a ration of
    // the project BPM.
    this.rampRange = {
      initialRatio: 2 / 3,
      finalRatio: 1,
      resolution: null,
    }
  }

  get initialTempo() {
    return this.BPM * this.rampRange.initialRatio;
  }

  get finalTempo() {
    return this.BPM * this.rampRange.finalRatio;
  }

  get initialRatio() {
    return this.rampRange.initialRatio;
  }

  get finalRatio() {
    return this.rampRange.finalRatio;
  }

  set initialRatio(v) {
    if (typeof v !== 'number') throw new Error('ramp ratio must be a number');
    this.rampRange.initialRatio = v;
  }

  set finalRatio(v) {
    if (typeof v !== 'number') throw new Error('ramp ratio must be a number');
    this.rampRange.finalRatio = v;
  }

  /**
   * @param {any[]|Number} nvl - the midiNote to create, specified as a midi
   *        note number, array:
   *          [0]: midi note
   *          [1]: midi velocity
   *          [2]: note length in beats at the project tempo
   *        or a function that returns the [n,v,l] array
   *
   * @param {Number} durationInBeatsAtInitialTempo - How long should the
   *        transition last, measure in beats at the initial tempo.
   * @param {Number|Number[]} beatsInChangingTempo - how many beats in the
   *        changing tempo. If this is an array, return an array of ramps.
   */
  createTempoRampNotes(nvl, durationInBeatsAtInitialTempo, beatsInChangingTempo) {
    let noteFunc; // a function that returns the [n, v, l] array

    if (Array.isArray(nvl)) {
      noteFunc = () => nvl;
    } else if (typeof nvl === 'number') {
      noteFunc = () => [nvl, 63, 0.25];
    } else if (typeof nvl == 'function') {
      noteFunc = nvl;
    } else if (s11.note.isNote(nvl)) {
      noteFunc = () => [nvl.value(), 63, 0.25]
    } else {
      throw new Error("createTempoRampNotes got bad note:" + nvl);
    }

    const r = util.ramp(
      this.initialTempo,
      this.finalTempo,
      durationInBeatsAtInitialTempo,
      beatsInChangingTempo,
      this.rampRange.resolution
    );

    for (let t of r.rampBeatTimes) {
      let [n, v, l] = noteFunc();
      const msg = create.launcherClipNote(n, v, t * this.BPM, l);
      this.io.send(msg);
    }
  }

  /**
   * Create a swarm of tempo ramps, ending in an arpeggio.
   *
   * I haven't toally thought through the math here, but it seems to be working
   * pretty well.
   *
   * The arppeggio might be a little weird when there are a lot of voices. In the
   * current implementation, the voices arp over a single beat of the final tempo.
   * @param {notes[]} notes - arrays of anything that createTempoRampNotes
   *        accepts (one per voice)
   * @param {Number} durationInBeatsAtInitial - number of beats in the transition
   *        at the initial tempo.
   * @param {Number[]} durationsInRamps - array of the transition beats (one
   *        per voice)
   */
  createRampsStartFirst(notes, durationInBeatsAtInitial, durationsInRamps) {
    const count = notes.length;

    // The duration of the transtion is specified in beats at the initial tempo.
    // However, we want the arpeggio that happens on completion to be in the
    // completion tempo. Assuming quarter notes, we need to specify one quarter
    // of a beat (at the end) in terms of the initial tempo.
    const extraEnd = (this.initialRatio / this.finalRatio) / count;

    console.log(extraEnd);

    for (let [i, [note, rampDuration]] of _.zip(notes, durationsInRamps).entries()) {
      let id = durationInBeatsAtInitial + (extraEnd * i);
      console.log(i, note, id, rampDuration)
      this.createTempoRampNotes(note, id, rampDuration);
    }
  }

  setClipLengthInBeatsAtProjectTempo(beats, tempo) {
    tempo = typeof tempo === 'number' ? tempo : this.BPM;
    const timeInMinutes = beats / tempo;

    // How many beats at the project bpm? Round to nearest beat if very close.
    const pBpm = this.BPM * timeInMinutes;
    const pBpmRound = Math.round(pBpm);
    const delta = Math.abs(pBpm - pBpmRound);
    const useBpm = delta < 0.00005 ? pBpmRound : pBpm;

    const msg = set.launcherClipLoop(0, useBpm);
    this.io.send(msg);
  }

  setClipLengthInBeatsAtInitialTempo(beats) {
    this.setClipLengthInBeatsAtProjectTempo(beats, this.initialTempo)
  }

  /**
   * Create and name a launcher clip, optionally deleting the existing clip.
   * @param {Integer} trackIndex - track number (starting on 1 - consistency!)
   * @param {Integer} clipIndex - clip position (starting on 1 - to match GUI)
   * @param {string} name - clip name
   * @param {bool} clear - should we delete the existing clip?
   */
  newLauncherClip(trackIndex, clipIndex, name, clear) {
    const msg = create.launcherClip(trackIndex-1, clipIndex-1, name, clear);
    this.io.send(msg);
  }

  close() {
    this.io.close()
  }
}

module.exports = Project;