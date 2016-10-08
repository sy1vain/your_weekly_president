"use strict";

const {ipcRenderer} = require('electron');

let frames = new Map();
let current = null;

ipcRenderer.on('/start', ()=>{
  frames.forEach((elem, id)=>{
    elem.remove();
  });
  frames.clear();
});

ipcRenderer.on('/frame', (sender, id, file)=>{
  if(!id || !file) return; //ignore invalids
  let elem = document.createElement('img');
  elem.setAttribute('data-id', id);
  elem.setAttribute('src', `file://${file}`);

  let images = document.querySelector('images');

  images.appendChild(elem);
});

ipcRenderer.on('/ready', (sender)=>{
  setInterval(showRandom, 100);
});

function showRandom(){
  var images = document.querySelectorAll('img');
  var img = images[Math.floor(images.length * Math.random())];

  img.style.display = 'block';

  if(current && current!=img) current.style.display = null;

  current = img;
}

ipcRenderer.send('/requestframes');
