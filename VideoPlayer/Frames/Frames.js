"use strict";
const Frame = require('./Frame');
const fs = require('fs');
const async = require('async');
const Broadcaster = require('../Broadcaster');

class Frames {

  constructor(){
      this._frames = [];

      Broadcaster.on('/requestframes', ()=>{
        this._frames.forEach((frame)=>{
          frame.broadcast();
        });
      });
  }

  loadMarkers(path, cb){
    fs.readFile(path, 'utf8', (err, data) => {
      if(err) return cb && cb(`unable to load markers: ${path}`);
      data = data.trim();

      var lines = data.split('\n');
      lines.forEach((line)=>{
        line = line.trim();
        var frame = new Frame(line);
        this._frames.push(frame);
      });

      this._frames.sort( (a,b)=>{
        return a.time < b.time;
      } );

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
        width: 1920/2,
        height: 1080/2
      }, next);
    }, cb);
  }
}

module.exports = Frames;
