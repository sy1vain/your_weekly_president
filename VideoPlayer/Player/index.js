"use strict"

const omx = require('omx-interface');
const path = require('path');

const IGNORE_STATUS_UPDATES_ON_START = 1;

class Player {

  constructor(){
    this._stopOnSeek = true;
    this._startDelay = 500;
    this._playing = false;
    this._startTime = 0;
    this._ignoreStatusUpdates = 0;

    this._filepath = path.join(__dirname, '..', '..', 'tmp', 'ywp.mp4');

    omx.onProgress((status)=>{
      this._handleStatus(status, false);
    });
  }

  play(position=0){
    console.log('play', position);
    this.seekTo(position);
  }

  get time(){
    if(this._startTime==0) return 0;
    return (Date.now() - this._startTime)/1000;
  }

  get playing(){
    return this._playing;
  }

  seekTo(position){
    position = position || 0;
    if(Math.abs(position-this.time)<1 && this.playing) return;

    clearTimeout(this._startDelayer);
    //mark as we are here
    this._handleStatus({position}, true);

    if(this._stopOnSeek){
      console.log('stop');
      omx.stop();
      this._playing = false;
    }

    if(this.playing){
      console.log('live seek');
      this._handleStatus({position}, true);
      omx.setPosition(position);
    }else{
      //delayed start in case we get another scrub
      this._startDelayer = setTimeout(()=>{

        this._playing = true;
        // !! we use position - 1 because there is an offset problem potentially
        omx.open(this._filepath, {
          startAt: position-1,
          blackBackground: false,
          disableKeys: true,
          disableOnScreenDisplay: true
        });
        console.log('start omx (from stopped state?)', position);
        //update internal position (again)
        this._handleStatus({position}, true);

      }, this._startDelay);
    }
  }

  _handleStatus(status, force){
    if(!status) return;
    if(!this._playing && !force) return;
    if(force===false && this._ignoreStatusUpdates>0){
      console.log('ignoring status update');
      this._ignoreStatusUpdates--;
      return;
    }
    //we forced it, so the next IGNORE_STATUS_UPDATES_ON_START ones will be wrong
    if(force===true){
      this._ignoreStatusUpdates = IGNORE_STATUS_UPDATES_ON_START;
    }
    console.log('handle status', status, force);
    this._startTime = Date.now() - status.position * 1000;
  }

}

module.exports = Player;
