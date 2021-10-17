'use strict';
const expect = require('chai').expect;
require('../../server/api-server');
const nock = require('nock');

const constants = require('../../server/constants');
const blogAPI = require('../../server/services/blog-api');
const axios = require('axios');
const SERVER_URL = `http://localhost:${constants.EXPRESS_PORT}`;

const mockHistoryTechLikesDesc = require('../mockData/correct_answer/solution_history_tech_likes_desc.json'); //https://api.hatchways.io/assessment/solution/posts?tags=history,tech&sortBy=likes&direction=desc
const mockPostsTech = require('../mockData/blog-api/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech
const mockPostsHistory = require('../mockData/blog-api/posts_history.json'); //https://api.hatchways.io/assessment/blog/posts?tag=history

suite('Testing Express API routes', () => {

  suite('GET /api/ping', () => {
    test('should respond ping route correctly', async () => {
      const {
        data: response
      } = await axios.get(`${SERVER_URL}/api/ping`);
      expect(response.success).to.equal(true)
    });
  });

  suite('POST /api/posts', () => {
    test('should return error, If `tags` parameter is not present ', async () => {
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?sortBy=likes&direction=desc`, {
        validateStatus: function() {
          return true;
        }
      });
      expect(status).to.equal(400);
      expect(response.error).to.equal("Tags parameter is required");
    });
    test('should return error, If `tags` parameter is not present 2 ', async () => {
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=&sortBy=likes&direction=desc`, {
        validateStatus: function() {
          return true;
        }
      });
      expect(status).to.equal(400);
      expect(response.error).to.equal("Tags parameter is required");
    });

    test('should return error, If `direction==up` is invalid value', async () => {
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=history,tech&sortBy=likes&direction=up`, {
        validateStatus: function() {
          return true;
        }
      });
      expect(status).to.equal(400)
      expect(response.error).to.equal("sortBy parameter is invalid")
    });

    test('should return error, If `sortBy==price` is invalid value', async () => {
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=history,tech&sortBy=price&direction=asc`, {
        validateStatus: function() {
          return true;
        }
      });
      expect(status).to.equal(400)
      expect(response.error).to.equal("sortBy parameter is invalid")
    });

    test('should return error, If `sortBy==35` is invalid value', async () => {
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=history,tech&sortBy=35&direction=asc`, {
        validateStatus: function() {
          return true;
        }
      });
      expect(status).to.equal(400)
      expect(response.error).to.equal("sortBy parameter is invalid")
    });

    test('should return posts correctly', async () => {
      nock(blogAPI.HOST)
        .get(blogAPI.PATH)
        .query(new URLSearchParams(`tag=tech`))
        .reply(200, mockPostsTech);

      nock(blogAPI.HOST)
        .get(blogAPI.PATH)
        .query(new URLSearchParams(`tag=history`))
        .reply(200, mockPostsHistory);

      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=history,tech&sortBy=likes&direction=desc`);
      expect(status).to.equal(200)
      expect(response).to.deep.equal(mockHistoryTechLikesDesc.posts);

      nock.cleanAll();
    });
  });


});
