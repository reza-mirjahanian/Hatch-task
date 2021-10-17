'use strict';
const logger = require('../utils/logger'),
  _ = require('lodash');


module.exports = class Post {

  fetchDataService = null

  /**
   * @constructor
   * @param {function} fetchDataService - A service that fetch raw data
   */
  constructor(fetchDataService) {
    this.fetchDataService = fetchDataService;
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
