"use strict";
const  {Frames} = require('./Frames');
const Broadcaster = require('./Broadcaster');

const path = require('path');

Broadcaster.send('/start');

var frames = new Frames();
frames.loadMarkers(path.join(__dirname, '..', '..', 'markers.txt'), function(err){
  if(err){
    return console.log('no frames found')
  }



});
