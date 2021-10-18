'use strict';

const
  isDevMode = process.env.NODE_ENV !== 'production',
  isTestMode = process.env.NODE_ENV === 'test';

const constants = {
  EXPRESS_PORT: Number(process.env.PORT) || 3200,
  CACHE_TIME: Number(process.env.CACHE_TIME) || 60 * 60,
  isTestMode
};

module.exports = constants;
