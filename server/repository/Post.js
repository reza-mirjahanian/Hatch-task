'use strict';

const logger = require('../utils/logger'),
  axios = require('axios'),
  _ = require('lodash');



module.exports = class Post {

  HOST = 'https://api.hatchways.io';
  PATH = '/assessment/blog/posts';
  API_URL = '';

  constructor() {
    this.API_URL = `${this.HOST}${this.PATH}`;
  }


  /**
   * Only filter one tag at a time
   * @param {string} tag
   * @return {Promise<Array>}
   */
  async fetchPost(tag = '') {
    try {
      if (!_.isString(tag) || _.size(tag) < 1) {
        throw new Error('Invalid tag')
      }
      const {
        data: {
          posts
        }
      } = await axios.get(this.API_URL, {
        params: {
          tag
        }
      });
      return posts;
    } catch (e) {
      logger.error(e.message, tag);
      throw Error('Post:fetchPost()')
    }
  }

  /**
   * Find, aggregate and sort posts and return
   * @param {Array} tags list of tags, example  ["tech", "health"]
   * @param option Configs like sort
   * @param {('id'|'reads'|'likes'|'popularity')} option.sortBy The field to sort the posts by
   * @param {('asc'|'desc')} option.direction The direction for sorting
   * @return {Promise<Array>}
   */
  async getPosts(tags = [], {
    sortBy = 'id',
    direction = 'asc'
  }) {
    if(!_.isArray(tags) || _.size(tags) < 1){
      throw Error('Tags parameter is required')
    }
    if(!_.includes( ['id','reads','likes','popularity'],sortBy) || !_.includes( ['asc','asc'],direction) ){
      throw Error('sortBy parameter is invalid')
    }

  }





}
