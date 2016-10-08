"use strict";
const osc = require('osc');

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
  }

  send(address, ...args){
    this.udpPort.send({
      address,
      args
    }, remoteAddress, remotePort);
  }

  on(channel, cb){
    ipcMain.on(channel, (evt, ...args)=>{
      cb && cb(...args);
    });
  }

}

module.exports = Broadcaster;
