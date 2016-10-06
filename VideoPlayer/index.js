"use strict";
const  {Frames} = require('./Frames');
const Broadcaster = require('./Broadcaster');
const path = require('path');

class VideoPlayer {

  constructor(){
    Broadcaster.send('/start');

    this.initFrames((err)=>{
      if(err){ return console.log('unable to prepare frames'); }
      Broadcaster.send('/ready');

    });
  }

  initFrames(cb){
    let frames = new Frames();
    this.frames = frames;

    frames.loadMarkers(path.join(__dirname, '..', '..', 'markers.txt'), function(err){
      if(err){
        console.log('no frames found');
        return cb && cb();
      }

      frames.createFiles(path.join(__dirname, '..', '..', 'ywp.mp4'), cb);

    });

  }

}

module.exports = VideoPlayer;
