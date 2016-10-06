"use strict";

const osc = require('osc');

class Broadcaster {

  constructor(){
    let udpPort = new osc.UDPPort({

    });
    udpPort.open();
    this.udpPort = udpPort;
  }

  send(address, ...args){
    this.udpPort.send({
      address,
      args
    }, '127.0.0.1', 8780);
  }

}

module.exports = new Broadcaster();
