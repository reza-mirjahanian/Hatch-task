'use strict';
const expect = require('chai').expect;

const PostRepo = require('../../server/repository/Post');
const _ = require('lodash');
const nock = require('nock');

const mockPostsTech = require('../mockData/blog-api/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech
const mockPostsHistory = require('../mockData/blog-api/posts_history.json'); //https://api.hatchways.io/assessment/blog/posts?tag=history
const mockPostsScience = require('../mockData/blog-api/posts_science.json'); //https://api.hatchways.io/assessment/blog/posts?tag=science
const mockPostsDesign = require('../mockData/blog-api/posts_design.json'); //https://api.hatchways.io/assessment/blog/posts?tag=deisign


suite('Testing Post Repository', () => {
  suite('async fetchDataService(tag)', () => {
    test('should return post for the "tech" tag correctly', async () => {
      const postRepo = new PostRepo();
      const tag = 'tech';
      nock(postRepo.HOST)
        .get(postRepo.PATH)
        .query(new URLSearchParams(`tag=${tag}`))
        .reply(200, mockPostsTech);
      const result = await postRepo.fetchDataService(tag);
      expect(result).to.be.an('array').that.have.lengthOf(28);
      expect(_.keys(result[0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      expect(result[0].tags).to.be.deep.equal(['tech', 'health'])

      nock.cleanAll();
    });

    test('should return Error for the wrong tag', async () => {
      const postRepo = new PostRepo();
      try {
        await postRepo.fetchDataService('')
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('Post:fetchDataService()')
      }
    });
  });

  suite('async getPosts()', () => {
    test('should return Error for the wrong tag parameter', async () => {
      const postRepo = new PostRepo();
      try {
        await postRepo.getPosts('')
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('Tags parameter is required')
      }
      try {
        await postRepo.getPosts([])
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('Tags parameter is required')
      }
    });

    test('should return post for the "tech,history" tags correctly', async () => {
      const postRepo = new PostRepo();
      const techTag = 'tech';
      const historyTag = 'history';
      const tags = [techTag, historyTag];
      nock(postRepo.HOST)
        .get(postRepo.PATH)
        .query(new URLSearchParams(`tag=${techTag}`))
        .reply(200, mockPostsTech);

      nock(postRepo.HOST)
        .get(postRepo.PATH)
        .query(new URLSearchParams(`tag=${historyTag}`))
        .reply(200, mockPostsHistory);
      const result = await postRepo.getPosts(tags);
      // expect(result).to.be.an('array').that.have.lengthOf(28);
      // expect(_.keys(result[0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      // expect(result[0].tags).to.be.deep.equal(['tech', 'health'])

      nock.cleanAll();
    });
  });



  suite('mergePost()', () => {

    test('should return Error for the wrong sort parameters', async () => {
      const postRepo = new PostRepo();
      try {
        await postRepo.mergePost([], {
          direction: 'left'
        })
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('sortBy parameter is invalid')
      }

      try {
        await postRepo.mergePost([], {
          sortBy: 'price'
        })
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('sortBy parameter is invalid')
      }

      try {
        await postRepo.mergePost([], {
          sortBy: 35
        })
        expect(1).to.be.equal(2);
      } catch (e) {
        expect(e.message).to.be.equal('sortBy parameter is invalid')
      }

        // const result = await postRepo.getPosts(tags, {
        //     sortBy: 'likes',
        //     direction: 'desc'
        // });

    });


  });


});
