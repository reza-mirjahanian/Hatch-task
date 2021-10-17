'use strict';
const expect = require('chai').expect;

const PostRepo = require('../../server/repository/Post');
const _ = require('lodash');
const nock = require('nock');

const mockPostsTech = require('../mockData/blog-api/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech
const mockPostsHistory = require('../mockData/blog-api/posts_history.json'); //https://api.hatchways.io/assessment/blog/posts?tag=history
const mockPostsScience = require('../mockData/blog-api/posts_science.json'); //https://api.hatchways.io/assessment/blog/posts?tag=science
const mockPostsDesign = require('../mockData/blog-api/posts_design.json'); //https://api.hatchways.io/assessment/blog/posts?tag=deisign

/// Final and correct answers
const mockTechIdDesc = require('../mockData/correct_answer/solution_tech_id_desc.json'); // https://api.hatchways.io/assessment/solution/posts?tags=tech&sortBy=id&direction=desc
const mockHistoryTechLikesDesc = require('../mockData/correct_answer/solution_history_tech_likes_desc.json'); //https://api.hatchways.io/assessment/solution/posts?tags=history,tech&sortBy=likes&direction=desc
const mockHistoryTechDesignReadsDesc = require('../mockData/correct_answer/solution_history_tech_design_reads_desc.json'); // https://api.hatchways.io/assessment/solution/posts?tags=history,tech,design&sortBy=reads&direction=desc
const mockHistoryTechDesignSciencePopularityDesc = require('../mockData/correct_answer/solution_history_tech_design_science_popularity_desc.json'); // https://api.hatchways.io/assessment/solution/posts?tags=history,tech,design,science&sortBy=popularity&direction=desc


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
      expect(result).to.be.an('array').that.have.lengthOf(2);
      expect(_.keys(result[0][0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      expect(_.keys(result[1][0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
      if (result[0].length === 26) {
        expect(result[1][0].tags).to.be.deep.equal(['tech', 'health'])
        expect(result[0][0].tags).to.be.deep.equal(['startups', 'tech', 'history'])
      } else if (result[0].length === 28) {
        expect(result[0][0].tags).to.be.deep.equal(['tech', 'health'])
        expect(result[1][0].tags).to.be.deep.equal(['startups', 'tech', 'history'])
      }

      nock.cleanAll();
    });

    //@todo test for errors
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


    });

    test('should merge one post array correctly (tags=history,tech&sortBy=likes&direction=desc)', async () => {
      const postRepo = new PostRepo();

      const resultDesc = await postRepo.mergePost([
        mockPostsTech.posts
      ], {
        sortBy: 'id',
        direction: 'desc'
      });

      const resultAsc = await postRepo.mergePost([
        mockPostsTech.posts
      ], {
        sortBy: 'id',
        direction: 'asc'
      });

      expect(resultDesc).to.be.deep.equal(mockTechIdDesc.posts);
      expect(resultAsc).to.be.deep.equal(mockTechIdDesc.posts.reverse());
    });

    test('should merge two post array correctly (tags=history,tech&sortBy=likes&direction=desc)', async () => {
      const postRepo = new PostRepo();

      const resultDesc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts
      ], {
        sortBy: 'likes',
        direction: 'desc'
      });

      const resultAsc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts
      ], {
        sortBy: 'likes',
      });

      expect(resultDesc).to.be.deep.equal(mockHistoryTechLikesDesc.posts);
      expect(resultAsc).to.be.deep.equal(mockHistoryTechLikesDesc.posts.reverse());
    });


    test('should merge three post array correctly (tags=history,tech,design&sortBy=reads&direction=desc)', async () => {
      const postRepo = new PostRepo();

      const resultDesc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts,
        mockPostsDesign.posts
      ], {
        sortBy: 'reads',
        direction: 'desc'
      });

      const resultAsc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts,
        mockPostsDesign.posts
      ], {
        sortBy: 'reads',
      });

      expect(resultDesc).to.be.deep.equal(mockHistoryTechDesignReadsDesc.posts);
      expect(resultAsc).to.be.deep.equal(mockHistoryTechDesignReadsDesc.posts.reverse());

    });

    test('should merge four post array correctly (tags=history,tech,design,science&sortBy=popularity&direction=desc)', async () => {
      const postRepo = new PostRepo();

      const resultDesc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts,
        mockPostsDesign.posts,
        mockPostsScience.posts
      ], {
        sortBy: 'popularity',
        direction: 'desc'
      });
      expect(resultDesc[0]).to.be.deep.equal(mockHistoryTechDesignSciencePopularityDesc.posts[0]);
      expect(resultDesc.length).to.be.deep.equal(mockHistoryTechDesignSciencePopularityDesc.posts.length);
      const resultAsc = await postRepo.mergePost([
        mockPostsTech.posts,
        mockPostsHistory.posts,
        mockPostsDesign.posts,
        mockPostsScience.posts
      ], {
        sortBy: 'popularity',
      });
      expect(resultAsc[10]).to.be.deep.equal(mockHistoryTechDesignSciencePopularityDesc.posts.reverse()[10]);
      expect(resultAsc.length).to.be.deep.equal(mockHistoryTechDesignSciencePopularityDesc.posts.length);

    });

  });


});
