_ = require('underscore');

/**
 * @param {Number} initialBpm - initial tempo in beats-per-minute
 * @param {Number} finalBpm - tempo to accelerate or decelerate to
 * @param {Number} durationInBeatsAtInitialTempo - How long should the
 *        transition last, measure in beats at the initial tempo.
 * @param {Number|Number[]} beatsInChangingTempo - how many beats in the
 *        changing tempo.
 * @param {Number} [resolution] - The equation is not solved for exact beat
 *        locations, so we evaluate it at a fixed interval to find the beats.
 */
const ramp = function(initialBpm, finalBpm, durationInBeatsAtInitialTempo, beatsInChangingTempo, resolution) {
  const v0 = initialBpm;
  const v1 = finalBpm;
  const b1 = beatsInChangingTempo;

  // check if this is an array. If it is, return an array of results
  if (_.isArray(beatsInChangingTempo)) {
    return beatsInChangingTempo.map((b) => {
      return ramp(v0, v1, durationInBeatsAtInitialTempo, b, resolution);
    });
  };

  // durationInMinutes and t have the same value. Note that t is occasionally
  // used in the argument to an iterator function.
  const durationInMinutes = durationInBeatsAtInitialTempo / initialBpm;
  const t = durationInMinutes;

  // initial acceleration
  const a0 = ((6 * b1) - (2 * t) * (v1 + (2 * v0))) / (t * t);

  // final acceleration
  const a1 = (v0 - v1 + (a0 * t)) * (-2/(t * t));

  resolution = resolution || 1000000;

  // array of times (in minutes) at which we will sample our curves
  const time = _(_.range(resolution + 1)).map(function(val){return val / resolution * durationInMinutes});

  // how many beats (in the changing tempo) have elapsed sampled at <resolution>
  const rampBeatsElapsed = _(time).map(function(t){
    return 0 + (v0 * t) + (a0 * t * t)/2 + (a1 * t * t * t)/6;
  });

  // current tempo, sampled at <resolution>
  const bpm = _(time).map(function(t){
    return v0 + (a0 * t) + (a1 * t * t)/2;
  });

  // how many beats (in the static tempo) elapsed, sampled at <resuolution>
  const staticBeatsElapsed = _(time).map(function(t){
    return initialBpm * t;
  });

  // We want to include the final beat (fencepost error)
  const staticBeatTimes = _.range(Math.floor(durationInBeatsAtInitialTempo + 1))
    .map((i) => i * (1/v0));

  // array of objects that look like this: [timeInMinutes, rampBeatsElapsed]
  const timesAndBeats = _.zip(time, rampBeatsElapsed)

  // We are looking for the time of each beat
  const rampBeatTimes = [];
  timesAndBeats.reduce((prev, current)=> {
      if (Math.floor(current[1]) > Math.floor(prev[1])) {
          rampBeatTimes.push(current[0]);
      }
      return current;
  }, [-1, -1]);

  return {
    rampBeatTimes,      // .length === beatsInChangingTempo
    staticBeatTimes,    // .length === durationInBeatAtInitialTempo
    rampBeatsElapsed,   // sampled at resolution
    staticBeatsElapsed, // sampled at resolution
    time,               // sampled at resolution
    bpm,                // sampled at resolution
  };
};

module.exports = ramp;
