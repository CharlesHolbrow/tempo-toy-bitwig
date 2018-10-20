const bw = require('./');

const project = new bw.Project(160);

project.newLauncherClip(1, 9, 'to fast', true);
project.createRampsStartFirst([48, 50, 53, 55], 32, [33, 34, 35, 36]);

// project.createTempoRampNotes([48, 80, 0.25], 32, 32);
// project.createRampsStartFirst([48, 50, 53], 32, [33, 34, 35])
// project.createTempoRampNotes([51, 80, 0.25], 32 + (project.initialRatio * 0.25), 33);
// project.createTempoRampNotes([53, 80, 0.25], 32 + (project.initialRatio * 0.5), 34);
// project.createTempoRampNotes([55, 80, 0.25], 32 + (project.initialRatio * 0.75), 35);
  
project.setClipLengthInBeatsAtInitialTempo(32);
project.close();
