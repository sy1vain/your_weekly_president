"use strict";
const  {Frames, FrameController} = require('./Frames');
const Player = require('./Player');
const Broadcaster = require('./Broadcaster');
const path = require('path');
const fs = require('fs');
const Settings = require('./Settings');

class VideoPlayer {

  constructor(){
    Broadcaster.send('/start');

    this.frameController = new FrameController();
    this.player = new Player(Settings.video_path);


    this.initFrames((err)=>{
      if(err){ return console.log('unable to prepare frames'); }
      Broadcaster.send('/ready');
      this.frameController.setFrames(this.frames.frames);
      this.player.play();
    });

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

    frames.loadMarkers(Settings.marker_path, (err)=>{
      if(err){
        console.log('no frames found');
        return cb && cb();
      }

      frames.createFiles(Settings.video_path, cb);
    });

  }

  next(){
    let frame = this.frameController.next();
    if(!frame) return;
    console.log(`should seek to ${frame.time}`);
    this.player.seekTo(frame.time);
  }

  prev(){
    let frame = this.frameController.prev();
    if(!frame) return;
    console.log(`should seek to ${frame.time}`);
    this.player.seekTo(frame.time);
  }

}

module.exports = VideoPlayer;
