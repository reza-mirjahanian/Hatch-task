'use strict';
const expect = require('chai').expect;

const PostRepo = require('../../server/repository/Post');
const _ = require('lodash');
const nock = require('nock');

const mockPostsTech = require('../mockData/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech


suite('Testing Post Repository', () => {
  suite('async fetchPost(tag)', () => {
    test('should return post for the "tech" tag correctly', async () => {
      const postRepo = new PostRepo();
      const tag = 'tech';
      console.log(mockPostsTech)
      nock(postRepo.HOST)
        .get(postRepo.PATH)
        .query(new URLSearchParams(`tag=${tag}`))
        .reply(200, mockPostsTech); // Not found!.
      const result = await postRepo.fetchPost(tag);
      expect(result).to.be.an('array').that.have.lengthOf(28);
      expect(_.keys(result[0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      expect(result[0].tags).to.be.deep.equal(['tech', 'health'])

      nock.cleanAll();
    });
  });


});
