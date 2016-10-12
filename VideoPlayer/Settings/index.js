"use strict";

const path = require('path');
const os = require('os');

const defaults = {
  frame_width: 960,
  frame_height: 540,
  tmp_path: os.tmpdir(),
  video_path: 'ywp.mp4',
  marker_path: 'markers.txt'
}

let possiblePaths = [
  path.join(__dirname, '..', '..', '..', 'your_weekly_president.json'),
  path.join(__dirname, '..', '..', '..', 'your_weekly_president', 'settings.json'),
  path.join(os.homedir(), 'your_weekly_president', 'settings.json'),
  path.join(os.homedir(), 'your_weekly_president.json'),
  path.join(os.homedir(), 'Documents', 'your_weekly_president', 'settings.json'),
  path.join(os.homedir(), 'Documents', 'your_weekly_president.json')
];

let loaded = {};
let basepath = __dirname;

for(let [index,settings_path] of possiblePaths.entries()){
  try{
    loaded = require(settings_path);
    basepath = path.dirname(settings_path);
    break;
  }catch(e){
  }
}

let settings = Object.assign({}, defaults, loaded );

for(let key in settings){
  if(key.includes('_path')){
    settings[key] = path.resolve(basepath, settings[key]);
  }
}


module.exports = settings;
