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

    this.player.on('close', ()=>{
      this.player.play();
    });


    this.initFrames((err)=>{
      if(err){ return console.log('unable to prepare frames'); }
      Broadcaster.send('/ready');
      this.frameController.setFrames(this.frames.frames);
      this.player.play();

      if(this.frames.frames && this.frames.frames.length) this.initPowerMate();
    });

    setInterval(()=>{
      // console.log(`time: ${this.player.time}`);
      let time = this.player.time;
      let duration = this.player.duration;
      if(duration>0 && time>=duration && !Settings.omx.loop) return this.player.play();
      this.frameController.updateTime(this.player.time);
    }, 250);

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

  initPowerMate(){
    const PowerMate = require('./PowerMate')
    this.powerMate = new PowerMate();
    this.powerMate.on('next', ()=>{
      if(!this.player.canSeek) return;
      this.next();
    });
    this.powerMate.on('prev', ()=>{
      if(!this.player.canSeek) return;
      this.prev();
    });
    this.powerMate.on('step', (delta)=>{

      if(!this.player.canSeek) return;

      while(delta>=1){
        delta -= 1;
        this.next();
      }

      while(delta<=-1){
        delta += 1;
        this.prev();
      }

    });
    this.powerMate.on('hold', ()=>{
      if(!this.player.canSeek) return;
      let frame = this.frameController.current;
      if(!frame) return;
      this.player.seekTo(frame.time);
    });
  }

  next(){
    let frame = this.frameController.next(true);
    if(!frame) return;
    console.log(`should seek to ${frame.time}`);
    this.player.seekTo(frame.time);
  }

  prev(){
    let frame = this.frameController.prev(true);
    if(!frame) return;
    console.log(`should seek to ${frame.time}`);
    this.player.seekTo(frame.time);
  }

}

module.exports = VideoPlayer;
