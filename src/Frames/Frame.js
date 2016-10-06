"use strict";
const _ = require('lodash');

class Frame {

  constructor(time){
    time = time || 0;
    this.time = timeToSeconds(time);
    this.timecode = timeToTimecode(time);
  }

}

module.exports = Frame;

function timeToSeconds(time){
  if(_.isNumber(time)) return time;

  var parts = time.split(':');

  var multiplier = 1;
  var total = 0;
  while(parts.length>0){
    total += multiplier * parseInt(parts.pop());
    multiplier *= 60;
  }
  return total;
}

function timeToTimecode(time){
  if(_.isString(time)) return time;

  var seconds = Math.floor(time) % 60;
  var minutes = Math.floor(time/60) % 60;
  var hours = Math.floor(time/3600) % 60;

  return hours.toFixed(2) + ':' + minutes.toFixed(2) + ':' + seconds.toFixed(2);
}
