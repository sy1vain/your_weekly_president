"use strict";
const Frame = require('./Frame');
const fs = require('fs');
const async = require('async');
const Broadcaster = require('../Broadcaster');
const Settings = require('../Settings');

class Frames {

  constructor(){
      this._frames = [];

      Broadcaster.on('/requestframes', ()=>{
        async.eachSeries(this._frames, (frame, next)=>{
          frame.broadcast();
          setTimeout(next, 10);
        });
      });
  }

  loadMarkers(path, cb){
    fs.readFile(path, 'utf8', (err, data) => {
      if(err) return cb && cb(`unable to load markers: ${path}`);

      var timecodes = data.match(/\d{2}:\d{2}:\d{2}\*?/g);

      timecodes.forEach((timecode)=>{
        var frame = new Frame(timecode);
        this._frames.push(frame);
      });

      return cb && cb(null, this.frames);
    });
  }

  get frames(){
    return this._frames;
  }

  createFiles(moviePath, cb){
    async.eachSeries(this.frames, (frame, next)=>{
      frame.createFrame({
        moviePath,
        width: Settings.frame_width,
        height: Settings.frame_height
      }, next);
    }, cb);
  }
}

module.exports = Frames;
