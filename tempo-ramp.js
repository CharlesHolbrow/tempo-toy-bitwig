_ = require('underscore');

initialBpm = v0 = 90;
finalBpm = v1 = 135;
durationInBeatsAtInitialTempo = 64;
durationInMinutes = t = durationInBeatsAtInitialTempo / initialBpm;
beatsInChangingTempo = b1 = p1 = 80;

initialAcceleration = a0 = ((6 * b1) - (2 * t) * (v1 + (2 * v0))) / (t * t);
finalAcceleration = a1 = (v0 - v1 + (initialAcceleration * t)) * (-2/(t * t));

// resolution of our time
resolution = 1000000;
// array of times (in minutes) at which we will sample our curves
time = _(_.range(resolution + 1)).map(function(val){return val / resolution * durationInMinutes});

// array of how many beats (in the changing tempo) have elapsed relative to time
beatsElapsed = _(time).map(function(t){
  return 0 + (v0 * t) + (a0 * t * t)/2 + (a1 * t * t * t)/6;
});

// array of current tempo, sampled <resolution> times
bpm = _(time).map(function(t){
  return v0 + (a0 * t) + (a1 * t * t)/2;
});

staticBeats = _(time).map(function(t){
  return initialBpm * t;
});

// array of objects that look like this: [timeInMinutes, beatsElapsedInChangingTempo]
timesAndBeats = _.zip(time, beatsElapsed)

// We are looking for the time 
timeResults = [];
timesAndBeats.reduce((prev, current)=> {
    if (Math.floor(current[1]) > Math.floor(prev[1])) {
        timeResults.push(current[0]);
    }
    return current;
}, [-1, -1]);

timeResults.reduce((prev, current) => {
    console.log((current - prev) * 60);
    return current;
}, 0);

