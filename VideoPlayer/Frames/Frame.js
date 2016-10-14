"use strict";
const _ = require('lodash');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const {sprintf} = require('sprintf-js');
const Broadcaster = require('../Broadcaster');
const Settings = require('../Settings');

if(require('os').platform()=='linux'){
  console.log('ffmpeg => /usr/bin/avconv');
  ffmpeg.setFfmpegPath('/usr/bin/avconv');
}

class Frame {

  constructor(data){
    data = data || "00:00:00";
    if(!_.isString(data)) data = data + "";

    var match = data.match(/(\d+)?.*(\d{2}:\d{2}:\d{2})/);
    this.id = match[1];
    let time = match[2];

    this.time = timeToSeconds(time);
    this.timecode = timeToTimecode(this.time);
    this.skippable = data.includes('*');
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
    if(!this.timecode || !this.filepath) return;
    Broadcaster.send('/frame', this.timecode, this.filepath);
  }

  createFrame(options = {
    moviePath: null
  }, next){
    options.width = options.width || '?';
    options.height = options.height || '?';

    if (!fs.existsSync(Settings.tmp_path)) fs.mkdirSync(Settings.tmp_path);
    let filepath = path.join(Settings.tmp_path, 'ywp-' + this.timecode.replace(/:/g, '_') + '_' + options.width + 'x' + options.height + '.jpg');

    fs.exists(filepath, (exists)=>{
      if(exists){
        this.filepath = filepath;
        return next();
      }

      console.log(`converting ${this.timecode} to ${filepath}`);

      let command = ffmpeg(options.moviePath).seekInput(this.timecode).outputOptions(['-vframes 1', '-qscale:v 2']);
      if(!(options.width=='?' && options.height=='?')) command.size(options.width+'x'+options.height);
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

  return sprintf('%02d:%02d:%02d', hours, minutes, seconds);
}
