"use strict"

const OMXPlayer = require('omxplayer');
const path = require('path');

class Player {

  constructor(){
    this._stopOnSeek = true;
    this._startDelay = 500;
    this._playing = false;
    this._startTime = 0;
    this._ignoreStatusUpdates = 0;

    this.player = new OMXPlayer();
    this.player.on('error', (err)=>{
      //catching error but ignoring it
    });

    this._filepath = path.join(__dirname, '..', '..', 'tmp', 'ywp.mp4');
  }

  play(position=0){
    console.log('play', position);
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

  seekTo(position){
    position = position || 0;

    clearTimeout(this._startDelayer);

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

      this.time = position;
      this._startPlayer(position, this._startDelay);
    });
  }

  _startPlayer(pos=0, delay=0){
    if(delay>0){
      this._startDelayer = setTimeout(()=>{
        this._startPlayer(pos);
      });
      return;
    }

    this.time = pos;

    this.player.open(this._filepath, {
      'no-osd': true,
      'no-keys': true,
      pos
    });
  }

}

module.exports = Player;
