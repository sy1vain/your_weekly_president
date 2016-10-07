"use strict";

try{
  const electron = require('electron');
  module.exports = new (require('./IPC'))();
}catch(e){
  module.exports = new (require('./OSC'))();
}
