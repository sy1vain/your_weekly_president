"use strict";

//fix modulo
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

const Settings = require('../Settings');
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

    this.step = Settings.powermate.step || 0.1;
    this.counter = 0;
  }

  handleTurn(delta){

    this.counter += this.step * delta;

    if(this.ignoring) return this.emit('hold');

    if(Math.abs(this.counter)>=1){
      let step = this.counter.clamp(-1,1);
      this.counter = this.counter.mod(1);

      this.emit('step', step);

      this.ignore(Settings.powermate.lock || 200);
    }


    return;


    if(this.ignoring) return;

    this.emit((delta>0)?'next':'prev');
    this.ignore(Settings.powermate.lock || 200);

    return;
    this.counter += this.step * delta;

    let jump = Math.floor(this.counter);
    if(this.counter<0) jump = Math.ceil(this.counter);

    if(Math.abs(jump)>=1){
      if(this.ignoring) return;
      this.counter = this.counter.mod(1);
      this.ignore(Settings.powermate.lock || 200);

      this.emit('jump', jump);
    }
  }

  ignore(time){
    if(this.ignoring) return;
    console.log(`ignore PowerMate for ${time} ms`);
    this.ignoring = true;
    setTimeout(()=>{
      this.ignoring = false;
    }, time);
  }

}

module.exports = PowerMate;
