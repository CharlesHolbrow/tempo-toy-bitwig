// more convenient way to make a request
// Example usage:
// request('post', '/integrate', {}, (err, res)=>{
//  console.log(err, res);
// });
function request(method, path, body, cb) {
  cb = cb || function(){};
  var r = new XMLHttpRequest();
  r.open(method, path, true);

  if (typeof body === 'object') {
    r.setRequestHeader('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  r.addEventListener('error', function(){ cb(error, this.response); });
  r.addEventListener('load', function(){
    var result, error;
    try {
      result = JSON.parse(this.response);
    } catch (e){
      result = this.response;
    }
    cb(null, result)
  });

  r.send(body);
}

// get the form data
function configData() {
  var result = {};
  var configForm = document.getElementById('config');
  var inputs = Array.from(configForm.getElementsByTagName('input'));
  var selects = Array.from(configForm.getElementsByTagName('select'));
  inputs.concat(selects).forEach((child) => {
    var name = child.getAttribute('name');
    var value = child.value;
    // If the value is all of the following, convert to number
    // 1. a non empty string
    // 2. converts to a number
    // 3. has no suffix (like '12px')
    if (!isNaN(+value) &&!isNaN(parseFloat(value))) value = +value;
    result[name] = value;
  });
  return result;
}



// Create buttons
var buttons = [];
var parent = document.createElement('div');
var focusElement = null
document.body.appendChild(parent)
for (var y = 1; y <= 6; y++) {
  var div = document.createElement('div')
  parent.appendChild(div);
  for (var x = 1; x <= 2; x++) {
    var b = document.createElement('button');
    b.innerText = '-';
    b.classList.add('btn');
    b.xy = {x: x, y: y};

    // careful... function declaration inside a for loop. Wrap in a closure.
    var f = function(b){
      b.onfocus = function(){
        focusElement = b
      }
    }(b);
    div.appendChild(b);
    buttons.push(b);
  }
}

// s11 does not include a way to lookup notes by their midi note number.
// I'll make that possible here via the midiNotes object, which indexes beginning at 24
var s11NotesByMidi = {}
var notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

(_.range(10)).forEach(function(octave){
  notes.forEach((noteName) => {
    var note = s11.note.create(noteName, octave);
    s11NotesByMidi[note.value()] = note;
  });
});


// ask for midi access
var parser = new help.MidiParser();
var midiNotesDown = {};
var lastChord = {
  s11Notes: [],
  name: '',
};

parser.on('noteOn', function(note, velocity, channel){
  midiNotesDown[note] = {
    midi: [note, velocity, channel],
    s11: s11NotesByMidi[note],
  };

  var down = _(midiNotesDown).map((o, key) => o.s11);
  var chordName = s11.chord.identifyArray(down);
  lastChord.s11Notes = down;
  lastChord.name = chordName;
  parser.emit('chord', lastChord);
});

parser.on('noteOff', function(note, velocity, channel){
  if (midiNotesDown[note]) delete midiNotesDown[note];
  if (Object.keys(midiNotesDown).length === 0) parser.emit('lastChord', lastChord);
});

parser.on('lastChord', function(chord){
  console.log(chord.name, chord.s11Notes);
});

parser.on('chord', function(chord){
  if (focusElement) {
    focusElement.innerText = chord.name;
    focusElement.chord = {
      name: chord.name,
      s11Notes: chord.s11Notes.map(function(a){ return a }),
    }
  }
});

// send
buttons.forEach(function(b){
  b.onclick = function(){
    if (!b.chord) return;
    console.log(b, b.chord.s11Notes);
    var requestBody = {
      x: b.xy.x,
      y: b.xy.y,
      notes: b.chord.s11Notes.map(function(v){ return v.value(); }),
      name: b.chord.name,
    };
    // add the values from the config form
    Object.assign(requestBody, configData());
    request('post', '/integrate', requestBody, function(err, res){
      if (err) console.log('Error sending request:', err, res);
    });
  }
});

// Annoying Midi Boilerplate
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false // this defaults to 'false'
  }).then(function(midiAccess){
    window.midiAccess = midiAccess;
    var inputs = midiAccess.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      // each time there is a midi message call the onMIDIMessage function
      input.value.onmidimessage = function(event){
        if (event.data) {
          parser.parseArray(event.data);
        }
      }
    }
  }, function(){console.log('failed to get midi access')});
} else {
  console.log("No MIDI support in your browser.");
}
