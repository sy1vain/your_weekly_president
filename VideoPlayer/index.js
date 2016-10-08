"use strict";
const  {Frames, FrameController} = require('./Frames');
const Player = require('./Player');
const Broadcaster = require('./Broadcaster');
const path = require('path');

class VideoPlayer {

  constructor(){
    Broadcaster.send('/start');

    this.frameController = new FrameController();
    this.player = new Player();


    this.initFrames((err)=>{
      if(err){ return console.log('unable to prepare frames'); }
      Broadcaster.send('/ready');
      this.frameController.setFrames(this.frames.frames);
    });

    this.player.play();

    setInterval(()=>{
      // console.log(`time: ${this.player.time}`);
      this.frameController.updateTime(this.player.time);
    }, 100);

    setInterval(()=>{
      console.log('do next..');

      for(let i=1; i<=5; i++){
        console.log(i);
        setTimeout(()=>{
          console.log('timedout!');
          this.next();
        }, 100*i)
      }

    }, 15000);
  }

  initFrames(cb){
    let frames = new Frames();
    this.frames = frames;

    frames.loadMarkers(path.join(__dirname, '..', 'tmp', 'markers.txt'), (err)=>{
      if(err){
        console.log('no frames found');
        return cb && cb();
      }

      frames.createFiles(path.join(__dirname, '..', 'tmp', 'ywp.mp4'), cb);
    });

  }

  next(){
    console.log('next!');
    let frame = this.frameController.next();
    if(!frame) return;
    console.log(`should seek to ${frame.time}`);
    this.player.seekTo(frame.time);
  }

  prev(){

  }

}

module.exports = VideoPlayer;
