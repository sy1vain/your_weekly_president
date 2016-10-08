"use strict";

console.log('** YOUR WEEKLY PRESIDENT**');

const VideoPlayer = require('./VideoPlayer');
let videoPlayer = new VideoPlayer();

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
}catch(e){
  console.log('no electron detected, runnign nod version')
}
