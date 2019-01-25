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
      console.log('client send invalid transition: ' + duration);
      res.status(500);
      return res.end('invalid duration-in-beats');
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
  var beats = notes.map((note, i) => duration + ((i + 1) * bInc));
  console.log(req.body, beats);

  project.newLauncherClip(body.x, body.y, body.name, true);
  project.createRampsStartFirst(body.notes, duration, beats);
  // duration is in 'beats@initial' we want it in projectBeats
  project.setClipLoop(duration * project.BPM / project.initialTempo, 1);
  project.setClipStart(0);

  res.setHeader('Content-Type', 'text/plain');
  res.end('ok');
});
app.listen(3001, '127.0.0.1');
