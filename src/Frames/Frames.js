"use strict";
const Frame = require('./Frame');
const fs = require('fs');

class Frames {

  constructor(){
      this._frames = [];
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

      return cb && cb(null, this.frames);
    });
  }

  get frames(){
    return this._frames;
  }
}

module.exports = Frames;
