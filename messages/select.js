/**
 * @param {Integer} trackIndex - The track number to insert the clip, beginning
 *        from the top/left
 * @param {Integer} clipIndex - The scene position, beginning from the top/left
 */
const launcherClipSlot = function(trackIndex, clipIndex) {
  return {
      address: '/launcher/select-clip',
      args: [
          {
              type: 'i',
              value: trackIndex,
          },
          {
            type: 'i',
            value: clipIndex,
        },
      ],
  }
}

module.exports = {
  launcherClipSlot,
}
