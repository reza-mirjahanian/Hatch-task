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
   * Only one tag at a time
   * @param {string} tag
   * @return {Promise<Array>}
   */
  async fetchDataService(tag = '') {
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
      throw Error('Post:fetchDataService()')
    }
  }

  /**
   * Fetch posts of each tag in concurrent mode
   * @param {Array} tags list of tags, example  ["tech", "health"]
   * @return {Promise<Array>}
   */
  async getPosts(tags = []) {
    try {
      //Concurrent requests to the API
      return await Promise.all(tags.map(tag => this.fetchDataService(tag)));
    } catch (e) {
      logger.error(e.message, {
        tags
      });
      throw Error('Post:getPosts()')
    }
  }

  /**
   * Aggregate, unique and sort posts and return
   * @param {Array} postsArray list of posts for each tag
   * @param option Configs like sort
   * @param {('id'|'reads'|'likes'|'popularity')} option.sortBy The field to sort the posts by
   * @param {('asc'|'desc')} option.direction The direction for sorting
   * @return {Array}
   */
  mergePost(postsArray = [], {
    sortBy = 'id',
    direction = 'asc'
  }) {


    //Merge and unique
    const mergeTable = new Map();
    for (const posts of postsArray) {
      for (const item of posts) {
        const {
          id
        } = item;
        if (!mergeTable.has(id)) {
          mergeTable.set(id, item)
        }
      }
    }
    const uniquePosts = [...mergeTable.values()]
    //Sorting
    return _.orderBy(uniquePosts, [sortBy], [direction]);
  }


}
