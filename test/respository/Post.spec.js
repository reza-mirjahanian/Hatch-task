'use strict';
const expect = require('chai').expect;

const PostRepo = require('../../server/repository/Post');
const _ = require('lodash');


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

  suite('async getPosts()', () => {

    test('should return post for the "tech,history" tags correctly', async () => {
      const techTag = 'tech';
      const historyTag = 'history';
      const mockBlogApi = async (tag) => {
        if (tag === techTag) {
          return Promise.resolve(mockPostsTech.posts)
        }
        if (tag === historyTag) {
          return Promise.resolve(mockPostsHistory.posts)
        }
      }
      const postRepo = new PostRepo(mockBlogApi);

      const tags = [techTag, historyTag];

      const result = await postRepo.getPosts(tags);
      // console.log({result})
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

    });

  });


  suite('mergePost()', () => {


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