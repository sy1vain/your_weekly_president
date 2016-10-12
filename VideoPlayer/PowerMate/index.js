"use strict";

const EventEmitter = require('events');

class PowerMate extends EventEmitter {

  constructor(){
    super();
    this.ignoring = false;
    this.powermate = new (require('node-powermate'))();
    this.powermate.setBrightness(0);
    this.powermate.on('wheelTurn', (wheelDelta)=>{
      this.handleTurn(wheelDelta);
    });
  }

  handleTurn(delta){
    if(this.ignoring) return;
    if(delta<0){
      this.emit('prev');
    }else if(delta>0){
      this.emit('next');
    }

    this.ignore(200);

  }

  ignore(time){
    if(this.ignoring) return;
    this.ignoring = true;
    setTimeout(()=>{
      this.ignoring = false;
    }, time);
  }

}

module.exports = PowerMate;
