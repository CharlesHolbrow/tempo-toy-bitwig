const s11 = require('sharp11');
const Rhythm = require('./Rhythm');

/**
 * Represents a looping chord progression. This gives lots of convenient ways
 * of creating a chord progression. Chords are saved as arrays of notes.
 */
class ChordProgression extends Rhythm {
  /**
   * Create a chord progression
   * @param {Integer[][]|sharp11.chord.Chord[]|String[]|String[][]} chords
   * @param {{Number[]|sharp11.duration.Duration[]}} durations
   */
  constructor(chords, durations) {
    super(durations);
    /**
     * @param {sharp11.note.Note[]}
     */
    this.chordList = chords.map(c => {
      if (typeof c === 'string') return s11.chord.create(c).chord; // string chord name
      else if (s11.chord.isChord(c)) return c.chord;               // chord
      else if (Array.isArray(c)) return c.map(n => {
        if (typeof n === 'string') return s11.note.create(n);      // string[] (array of note names)
        else if (s11.note.isNote(n))return n;                      // s11.note.Note[]
        else throw new Error('ChordProgression constructor - chords argument invalid');
      });
      else throw new Error('ChordProgression constructor - chords argument invalid');
    });
  }

  /**
   * Get the chord at given time
   * @param {Number|sharp11.duration.Duration} - look up a chord
   * @returns {sharp11.chord.Chord} 
   */
  chordAt(duration) {
    const i = this.indexAt(duration)
    return this.chordList[i % this.chordList.length];
  }

  /**
   * Get the note, given a certain voice
   * @param {Number|sharp11.duration.Duration} duration
   * @param {Index} voiceIndex
   */
  noteAt(duration, voiceIndex) {
    const c = this.chordAt(duration);
    if (Array.isArray(c)) return c[voiceIndex % c.length];
    return c.chord[voiceIndex % c.chord.length];
  }
}

module.exports = ChordProgression;
