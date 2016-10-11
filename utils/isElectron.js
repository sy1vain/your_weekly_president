try {
  const electron = require('electron');

  module.exports = electron;

  if(typeof electron=='string'){
    module.exports = false;
  }
}catch(e){
  module.exports = false;
}
