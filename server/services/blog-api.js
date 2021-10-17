const axios = require('axios'),
  logger = require('../utils/logger'),
  _ = require('lodash');

const HOST = 'https://api.hatchways.io',
  PATH = '/assessment/blog/posts';

/**
 * Only one tag at a time
 * @param {string} tag
 * @return {Promise<Array>}
 */
module.exports = {
  HOST,
  PATH,
  run: async (tag) => {
    try {
      if (!_.isString(tag) || _.size(tag) < 1) {
        throw new Error('Invalid tag')
      }
      const API_URL = `${HOST}${PATH}`;
      const {
        data: {
          posts
        }
      } = await axios.get(API_URL, {
        params: {
          tag
        }
      });
      return posts;

    } catch (e) {
      logger.error(e.message, tag);
      throw Error('Service:bog-api()')
    }
  }
}
