"use strict";

if(require('../../utils/isElectron')){
  module.exports = new (require('./IPC'))();
}else{
  module.exports = new (require('./OSC'))();
}
