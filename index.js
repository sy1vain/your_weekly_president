"use strict";

console.log('** YOUR WEEKLY PRESIDENT**');

const electron = require('./utils/isElectron');

const VideoPlayer = require('./VideoPlayer');
let videoPlayer = new VideoPlayer();

if(electron){
  const {app, BrowserWindow} = electron;

  app.on('ready', ()=>{
    let win = new BrowserWindow({width: 1920, height: 1080, useContentSize: true});
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/html/index.html`);

    // win.webContents.openDevTools();
  });

  app.on('window-all-closed', ()=>{
    app.quit();
  });
}
