/**
 * Returns a `create-note` message. Sending this message to bitwig will create
 * a note in the currently selected launcher clip.
 * @param {Integer} midiNoteNumber
 * @param {Integer} midiVelocity
 * @param {Float} startBeat - start time in beats
 * @param {Float} durationBeat - duration in beats
 */
const launcherClipNote = function(midiNoteNumber, midiVelocity, startBeat, durationBeat) {
    return {
        address: '/launcher/selected-clip/create-note',
        args: [
            {
                type: 'i',
                value: midiNoteNumber % 128,
            },{
                type: 'i',
                value: midiVelocity % 128,
            },{
                type: 'f',
                value: startBeat,
            },{
                type: 'f',
                value: durationBeat,
            },
        ],
    }
}

module.exports = {
    launcherClipNote,
};
