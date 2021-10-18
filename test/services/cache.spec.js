'use strict';
const expect = require('chai').expect;
const CacheService = require('../../server/services/cache');

suite('Testing Cache Service', () => {
  suite('wrap(func)', () => {
    test('should not call a cached function', async () => {
      let callCount = 0;
      const testFunc = {
        power: (a) => {
          callCount++;
          return Promise.resolve(a * 10 * 10);
        }
      };

      const cache = new CacheService(60 * 10);
      const powerWithCache = cache.wrap(testFunc.power);
      await powerWithCache(4);
      expect(callCount).be.equal(1);

      await powerWithCache(4);
      await powerWithCache(4);
      await powerWithCache(4);
      await powerWithCache(4);
      await powerWithCache(4);
      expect(callCount).be.equal(1);
      cache.clenUp();
      await powerWithCache(4);
      await powerWithCache(4);
      expect(callCount).be.equal(2);

    });


  });

});
