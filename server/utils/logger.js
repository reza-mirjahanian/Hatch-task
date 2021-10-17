'use strict';
const constants = require('../constants')
//@todo use better Logger
module.exports = {
  log: (message = '', extra) => {
    if(!constants.isTestMode){
      console.log("#Log: " + message);
      if (extra) {
        console.log(extra)
      }
    }

  },
  error: (message = "Error!", extra) => {
    if(!constants.isTestMode){
      console.error("#Error: " + message);
      if (extra) {
        console.error(extra)
      }
    }

  }
}
