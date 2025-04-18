"use strict"

const OMXPlayer = require('omxplayer');
const Settings = require('../Settings');
const EventEmitter = require('events');
const path = require('path');

class Player extends EventEmitter {

  constructor(filepath){
    super();

    this._playing = false;
    this._startTime = 0;
    this._duration = -1;
    this._seekLockTime = 0;
    this._playerOpen = false;
    this._playerStopping = false;

    this._startDelay = 1000 * (Settings.player.start_delay || 1);
    this._stopOnSeek = (Settings.player.stop_on_seek!==false) && true;
    this._lockSeek = 1000 * (Settings.player.lock_seek || 1);
    this._syncTime = (Settings.player.sync_time!==false) && true;

    this.player = new OMXPlayer();
    this.player.on('error', (err)=>{
      //catching error but ignoring it
    });

    this._filepath = filepath;
  }

  play(position=0){
    this.seekTo(position);
  }

  get time(){
    if(this._startTime==0) return 0;

    if(this._syncTime && this._playerOpen && !this._playerStopping && this.canSeek){
      this.player.getPosition((err, position)=>{
        if(err) return;
        if(position>this.duration) return;
        if(this._playerStopping) return;
        this.time = position;
      });
    }

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
    return !this._playerOpen || Date.now()>this._seekLockTime;
  }

  set canSeek(b){
    if(b){
      this._seekLockTime = 0;
    }else{
      this._seekLockTime = Date.now() + this._lockSeek;
    }
  }

  _onPlayerClose(emit=false){
    console.log('player close', emit);
    this._duration = -1;
    this._playerStopping = false;
    if(emit) this.emit('close');
  }

  _stopPlayer(cb){
    if(!this._playerOpen) return;
    if(this._playerStopping) return;

    this._playerStopping = true;

    //remove all close listeners and re-attach
    //but prevent it from being emitted
    this.player.removeAllListeners('close');
    this.player.on('close', ()=>{
      this._onPlayerClose(false);
    });

    this.player.quit((err)=>{
      this._playerOpen = false;
      this.canSeek = true;
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

      //remove close listeners and re attach
      this.player.removeAllListeners('close');
      this.player.on('close', ()=>{
        this._onPlayerClose(true);
      });
      this.player.open(this._filepath, omxOptions);

      console.log('starting player!');
    }, this._startDelay);
  }

}

module.exports = Player;
