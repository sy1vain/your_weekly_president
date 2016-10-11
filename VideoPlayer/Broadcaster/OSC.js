"use strict";
const osc = require('osc');
const EventEmitter = require('events');

const remotePort = 8780;
const remoteAddress = '127.0.0.1';
const localPort = 8781;
const localAddress = '0.0.0.0';

class Broadcaster {

  constructor(){
    let udpPort = new osc.UDPPort({
      localAddress,
      localPort
    });
    udpPort.open();
    this.udpPort = udpPort;

    this.emitter = new EventEmitter();

    this.udpPort.on('message', (message)=>{
      this.emitter.emit(message.address, ...message.args);
    });
  }

  send(address, ...args){
    this.udpPort.send({
      address,
      args
    }, remoteAddress, remotePort);
  }

  on(channel, cb){
    this.emitter.on(channel, cb);
  }

}

module.exports = Broadcaster;
