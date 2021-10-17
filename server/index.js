'use strict';
const logger = require('./utils/logger');
require('./api-server');

console.log('Server Is Running!')


//Caught other errors
process
  .on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at Promise', {
      reason,
      p
    });
  })
  .on('uncaughtException', err => {
    logger.error('Uncaught Exception thrown', {
      err
    });
  });


