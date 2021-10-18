const NodeCache = require('node-cache');
const _ = require('lodash');

module.exports = class Cache {

  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  wrap(func) {
    return async (key) => {
      const value = this.cache.get(key);
      if (value) {
        return value;
      }

      const result = await func(key);
      this.cache.set(key, result);
      return result;

    }

  }


  clenUp() {
    this.cache.flushAll();
  }
}