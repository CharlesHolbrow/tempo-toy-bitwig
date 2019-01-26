const path = require('path');
const express = require('express');

const app = express();
const bw = require('./');

const project = new bw.Project(160);


app.use('/', express.static(path.join(__dirname, '/static')));
app.use(express.json());


app.post('/integrate', (req, res) => {
  // validate input
  if (!req.body
    || typeof req.body.x !== 'number'
    || typeof req.body.y !== 'number'
    || !Array.isArray(req.body.notes)
    || typeof req.body.name !== 'string') {
      console.log('client sent bad value', req.body);
      res.status(500);
      return res.end('bad json');
  }
  if (req.body.notes.length > 24) {
    console.log('client sent too many notes');
    res.status(500);
    return res.end('too many notes.') // lol
  }

  var duration = req.body['duration-in-beats'];
  if (!duration) duration = 32;
  if (typeof duration !== 'number'
    || duration < 0
    || duration > 2048) {
      console.log('client send invalid duration: ' + duration);
      res.status(500);
      return res.end('invalid duration-in-beats');
  }
  var transitionBeats = req.body['transition-beats'];
  if (typeof transitionBeats !== 'number'
    || transitionBeats <= 0
    || transitionBeats > 2048) {
      console.log('client sent invalid transition beats: ' + transitionBeats);
      res.status(500);
      return res.send('invalid transition-beats');
  }
  var startStyle = req.body['start-style'];
  if (typeof startStyle !== 'string') startStyle = 'flat';
  if (startStyle !== 'arp-up' && startStyle !== 'flat') {
    console.log('client sent invalid start style: ' + startStyle);
    res.status(500);
    return res.end('invalid start style');
  }

  for (let note of req.body.notes) {
    if (typeof note !== 'number' || note < 0 || note > 127) {
      console.log('bad notes:', req.body.notes);
      res.status(500);
      return res.end('bad notes');
    }
  }

  const pBPM = req.body['project-bpm'];
  const iBPM = req.body['initial-bpm'];
  const fBPM = req.body['final-bpm'];
  if (typeof pBPM === 'number' && pBPM > 0) project.BPM = pBPM;
  if (typeof iBPM === 'number' && iBPM > 0) project.initialTempo = iBPM;
  if (typeof fBPM === 'number' && fBPM > 0) project.finalTempo = fBPM;

  const accelerating = (project.finalTempo >= project.initialTempo);
  const bInc = accelerating ? 1 : -1;

  // We are going to make several ramps. Each note will have its own ramp. Make
  // an array with one number for each ramp (the number of the note to ramp)
  var body = req.body;
  var notes = body.notes.map((n) => Math.floor(n)); // ex [60, 63, 67]
  // beats example (accelerating) [33, 34, 35]
  // beats example (decelerating) [31, 30, 29]
  var beats = notes.map((note, i) => transitionBeats + ((i) * bInc));
  console.log(req.body, beats);

  project.newLauncherClip(body.x, body.y, body.name, true);
  // I'm putting the rest this function in the timeout below as an experiment.
  // Will this stop the bug where occasionally the notes would not be created
  // inside the new bitwig clip?
  setTimeout(()=>{
    project.createRampsStartFirst(body.notes, duration, beats, startStyle);
    // duration is in 'beats@initial' we want it in projectBeats
    // setClipLoop expects values specified relative to the project tempo
    // duration/initialRatio converts beats@initalBPM to beats@projectBPM
    // 1/finalRatio is one measure at final bpm expressed in beats@projectBPM
    project.setClipLoop(duration/project.initialRatio, 1/project.finalRatio);
    project.setClipStart(0);
    // send response
    res.setHeader('Content-Type', 'text/plain');
    res.end('ok');
  }, 10);
});
app.listen(3001, '127.0.0.1');
