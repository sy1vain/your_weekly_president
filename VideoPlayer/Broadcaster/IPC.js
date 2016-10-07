"use strict";
const {app, BrowserWindow} = require('electron');

class Broadcaster {

  constructor(){
  }

  send(address, ...args){
    BrowserWindow.getAllWindows().forEach((window)=>{
      window.webContents.send(address, ...args);
    });
  }

}

module.exports = Broadcaster;
