const bw = require('./');

const project = new bw.Project(160);



const c1 = [48, 50, 53, 55];
const c2 = [50, 57, 62, 65];
const b1 =[33, 34, 35, 36];

// project.newLauncherClip(1, 9, 'Cm', true);
// project.createRampsStartFirst(c1, 32, b1);
// project.setClipLoop(12*4, 1);
// project.setClipStart(0);

// project.newLauncherClip(2, 9, 'Eb', true);
// project.createRampsStartFirst(c2, 32, b1); 
// project.setClipLoop(12*4, 1);
// project.setClipStart(0);

project.newLauncherClip(1, 10, 'l1', true);
project.createRampsStartFirst(c1.map(v => v+3), 32, b1); 
project.setClipLoop(12*4, 1);
project.setClipStart(0);

project.newLauncherClip(2, 10, 'h1', true);
project.createRampsStartFirst(c2.map(v => v+3), 32, b1); 
project.setClipLoop(12*4, 1);
project.setClipStart(0);

project.close();
  


