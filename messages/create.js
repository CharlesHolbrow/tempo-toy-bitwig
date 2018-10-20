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

/**
 * Create a new clip. An existing clip in the specified position will be
 * renamed, but not cleared or removed. The clip will be selected in the GUI.
 * @param {Integer} trackIndex - The track number to insert the clip, beginning
 *        from the top/left
 * @param {Integer} clipIndex - The scene position, beginning from the top/left
 * @param {String} clipName - Name the clip. Will overwrite an existing name
 * @param {Bool} [clear=false] - should we clear the clip if it already exists?
 */
const launcherClip = function(trackIndex, clipIndex, clipName, clear) {
    return {
        address: '/launcher/create-clip',
        args: [
            {
                type: 'i',
                value: trackIndex,
            },{
                type: 'i',
                value: clipIndex,
            },{
                type: 's',
                value: clipName,
            },{
                type: 'i',
                value: clear ? 1 : 0,
            },
        ],
    };
};

module.exports = {
    launcherClipNote,
    launcherClip,
};
