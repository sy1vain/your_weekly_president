"use strict"

const OMXPlayer = require('omxplayer');
const Settings = require('../Settings');
const EventEmitter = require('events');
const path = require('path');

class Player extends EventEmitter {

  constructor(filepath){
    super();
    this._stopOnSeek = true;
    this._startDelay = 1000;
    this._playing = false;
    this._startTime = 0;
    this._ignoreStatusUpdates = 0;
    this._duration = -1;
    this._seekLockTime = 0;
    this._playerOpen = false;
    this._lockSeek = 1000;

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

    if(!this._playerOpen){
      this._startPlayer(position);
      return;
    }

    //just do it
    if(!this._stopOnSeek){
      this.player.setPosition(position, (err, seconds)=>{
        this.time = seconds;
      });
      return;
    }

    //we have only just begon probably
    if(!this.canSeek) return;

    this._stopPlayer(()=>{
      this._startPlayer(position);
    });
  }

  get canSeek(){
    return Date.now()>this._seekLockTime;
  }

  set canSeek(b){
    if(b){
      this._seekLockTime = 0;
    }else{
      this._seekLockTime = Date.now() + this._lockSeek;
    }
  }

  _stopPlayer(cb){
    if(!this._playerOpen) return;

    this.player.kill(()=>{
      this._playerOpen = false;
      return cb && cb();
    });
  }

  _startPlayer(pos=0){
    if(this._playerOpen) return;

    clearTimeout(this._startDelayer);
    this._startDelayer = setTimeout(()=>{
      this.time = pos;
      this.duration = -1;
      this.canSeek = false;
      this._playerOpen = true;

      pos = pos - 1;
      let omxOptions = Object.assign({}, {
        'no-osd': true,
        'no-keys': true
      }, Settings.omx || {}, {pos});
      this.player.open(this._filepath, omxOptions);
      console.log('starting player!');
    }, this._startDelay);
  }

}

module.exports = Player;
