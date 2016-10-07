"use strict";

console.log('** YOUR WEEKLY PRESIDENT**');

const VideoPlayer = require('./VideoPlayer');

try{
  const {app, BrowserWindow} = require('electron')

  app.on('ready', ()=>{
    let win = new BrowserWindow({width: 1920, height: 1080, useContentSize: true});
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/html/index.html`);

    win.webContents.openDevTools()

  });

  app.on('window-all-closed', ()=>{
    app.quit();
  });

  //open window etc
  let videoPlayer = new VideoPlayer();
}catch(e){
  let videoPlayer = new VideoPlayer();
}
