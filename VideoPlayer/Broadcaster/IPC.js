"use strict";
const {app, BrowserWindow, ipcMain} = require('electron');

class Broadcaster {

  constructor(){
  }

  send(address, ...args){
    BrowserWindow.getAllWindows().forEach((window)=>{
      window.webContents.send(address, ...args);
    });
  }

  on(channel, cb){
    ipcMain.on(channel, (evt, ...args)=>{
      cb && cb(...args);
    });
  }

}

module.exports = Broadcaster;
