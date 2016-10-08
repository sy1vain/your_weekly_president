"use strict";
const  {Frames, FrameController} = require('./Frames');
const Broadcaster = require('./Broadcaster');
const path = require('path');

class VideoPlayer {

  constructor(){
    Broadcaster.send('/start');
    this.initFrames((err)=>{
      if(err){ return console.log('unable to prepare frames'); }
      Broadcaster.send('/ready');
      this.frameController.setFrames(this.frames.frames);
    });

    let start = Date.now();

    setInterval(()=>{
      this.frameController.updateTime( (Date.now()-start)/1000 );
    }, 100);
  }

  initFrames(cb){
    let frames = new Frames();
    this.frames = frames;
    this.frameController = new FrameController();

    frames.loadMarkers(path.join(__dirname, '..', 'tmp', 'markers.txt'), (err)=>{
      if(err){
        console.log('no frames found');
        return cb && cb();
      }

      frames.createFiles(path.join(__dirname, '..', 'tmp', 'ywp.mp4'), cb);
    });

  }

}

module.exports = VideoPlayer;
