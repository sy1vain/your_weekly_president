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
  if(frames.has(id)) frames.get(id).remove();

  frames.set(id, elem);

  document.querySelector('counter').innerHTML = frames.size;
});

ipcRenderer.on('/show', (sender, id)=>{
  if(!frames.has(id)){
    ipcRenderer.send('/requestframes');
    return;
  }

  var elem = frames.get(id);
  elem.classList.toggle('show', true);
  if(current) current.classList.toggle('show', false);
  current = elem;
});

ipcRenderer.on('/hide', (sender)=>{
  document.querySelectorAll('.show').forEach( (el)=>{
    el.classList.toggle('show', false);
  });
  current = null;
});


ipcRenderer.send('/requestframes');
