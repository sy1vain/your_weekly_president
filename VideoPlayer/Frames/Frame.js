"use strict";
const _ = require('lodash');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const path = require('path');
const fs = require('fs');
const Broadcaster = require('../Broadcaster');

if(os.platform()=='linux'){
  console.log('ffmpeg => /usr/bin/avconv');
  ffmpeg.setFfmpegPath('/usr/bin/avconv');
}

class Frame {

  constructor(time){
    time = time || 0;
    this.time = timeToSeconds(time);
    this.timecode = timeToTimecode(time);
    this._filepath = null;
  }

  set filepath(filepath){
    this._filepath = filepath;
    this.broadcast();
  }

  get filepath(){
    return this._filepath;
  }

  broadcast(){
    Broadcaster.send('/frame', this.timecode, this.filepath);
  }

  createFrame(options = {
    moviePath: null
  }, next){
    options.width = options.width || 1920;
    options.height = options.height || 1080;

    let filepath = path.join(os.tmpdir(), 'ywp-' + this.timecode.replace(/:/g, '_') + '_' + options.width + 'x' + options.height + '.jpg');

    fs.exists(filepath, (exists)=>{
      if(exists){
        this.filepath = filepath;
        return next();
      }

      console.log(`converting ${this.timecode} to ${filepath}`);

      let command = ffmpeg(options.moviePath).seekInput(this.timecode).outputOptions(['-vframes 1', '-qscale:v 2']);
      command.size(options.width+'x'+options.height);
      command.output(filepath).on('end', ()=>{
        this.filepath = filepath;
        next();
      }).on('error', next);
      command.run();
    });

  }

}

module.exports = Frame;

function timeToSeconds(time){
  if(_.isNumber(time)) return time;

  var parts = time.split(':');

  var multiplier = 1;
  var total = 0;
  while(parts.length>0){
    total += multiplier * parseInt(parts.pop());
    multiplier *= 60;
  }
  return total;
}

function timeToTimecode(time){
  if(_.isString(time)) return time;

  var seconds = Math.floor(time) % 60;
  var minutes = Math.floor(time/60) % 60;
  var hours = Math.floor(time/3600) % 60;

  return hours.toFixed(2) + ':' + minutes.toFixed(2) + ':' + seconds.toFixed(2);
}
