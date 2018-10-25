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

  for (let note of req.body.notes) {
    if (typeof note !== 'number' || note < 0 || note > 127) {
      console.log('bad notes:', req.body.notes);
      res.status(500);
      return res.end('bad notes');
    }
  }

  var notes = req.body.notes.map((n) => Math.floor(n));
  var body = req.body;
  var beats = notes.map((note, i) => 33 + i);

  project.newLauncherClip(body.x, body.y, body.name, true);
  project.createRampsStartFirst(body.notes, 32, beats);
  project.setClipLoop(12*4, 1);
  project.setClipStart(0);

  res.setHeader('Content-Type', 'text/plain');
  res.end('ok');
});
app.listen(3001, '127.0.0.1');
