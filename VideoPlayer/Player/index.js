"use strict"

const OMXPlayer = require('omxplayer');
const EventEmitter = require('events');
const path = require('path');

class Player extends EventEmitter {

  constructor(filepath){
    super();
    this._stopOnSeek = true;
    this._startDelay = 500;
    this._playing = false;
    this._startTime = 0;
    this._ignoreStatusUpdates = 0;
    this._duration = -1;

    this.player = new OMXPlayer();
    this.player.on('error', (err)=>{
      //catching error but ignoring it
    });

    this.player.on('close', ()=>{
      this._duration = -1;
      this.emit('close');
    });

    this._filepath = filepath;
  }

  play(position=0){
    this.seekTo(position);
  }

  get time(){
    if(this._startTime==0) return 0;
    return (Date.now() - this._startTime)/1000;
  }

  set time(seconds){
    if(isNaN(seconds)) return;
    this._startTime = Date.now() - 1000*seconds;
  }

  get playing(){
    return this._playing;
  }

  get duration(){
    if(this._duration==-1){
      this.player.getDuration((err, seconds)=>{
          if(err) return;
          this.duration = seconds;
      });
    }
    return this._duration;
  }

  set duration(seconds){
    this._duration = seconds;
  }

  seekTo(position){
    position = position || 0;

    this.time = position;

    this.player.getPosition((err, seconds)=>{
      if(err){
        this._startPlayer(position, this._startDelay);
        return;
      }
      if(Math.abs(seconds-position)<1) return; //close enough

      if(!this._stopOnSeek){
        this.player.setPosition(position, (err, seconds)=>{
          this.time = seconds;
        });
        return;
      }

      this._startPlayer(position, this._startDelay);
    });
  }

  _startPlayer(pos=0, delay=0){
    clearTimeout(this._startDelayer);

    this.player.quit();
    this.player.kill(()=>{
      if(delay>0){
        this._startDelayer = setTimeout(()=>{
          this._startPlayer(pos);
        }, delay);
        return;
      }

      this.time = pos;
      this.duration = -1;

      pos = pos - 1;
      this.player.open(this._filepath, {
        'no-osd': true,
        'no-keys': true,
        pos
      });
    });
  }

}

module.exports = Player;
