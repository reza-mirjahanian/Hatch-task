'use strict';
const expect = require('chai').expect;

const blogAPI = require('../../server/services/blog-api');
const _ = require('lodash');
const nock = require('nock');

const mockPostsTech = require('../mockData/blog-api/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech


suite('Testing Blog API Service', () => {
  suite('async fetchDataService(tag)', () => {
    test('should return post for the "tech" tag correctly', async () => {
      const tag = 'tech';
      nock(blogAPI.HOST)
        .get(blogAPI.PATH)
        .query(new URLSearchParams(`tag=${tag}`))
        .reply(200, mockPostsTech);
      const result = await blogAPI.run(tag);
      expect(result).to.be.an('array').that.have.lengthOf(28);
      expect(_.keys(result[0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      expect(result[0].tags).to.be.deep.equal(['tech', 'health'])

      nock.cleanAll();
    });

    test('should return Error for the wrong tag', async () => {
      try {
        await blogAPI.run('')
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('Service:bog-api()')
      }
    });
  });

});