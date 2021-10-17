'use strict';
const expect = require('chai').expect;
require('../../server/api-server'); //@todo maybe cleanup

const constants = require('../../server/constants');
const PostRepo = require('../../server/repository/Post');
const axios = require('axios');
const _ = require('lodash');
const sinon = require("sinon");
const SERVER_URL = `http://localhost:${constants.EXPRESS_PORT}`;

const mockHistoryTechLikesDesc = require('../mockData/correct_answer/solution_history_tech_likes_desc.json'); //https://api.hatchways.io/assessment/solution/posts?tags=history,tech&sortBy=likes&direction=desc

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
      //@todo fix stub
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
      //@todo fix stub
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
      //@todo fix stub
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
      const postRepo = new PostRepo();
      //@todo fix stub
      const {
        data: response,
        status
      } = await axios.get(`${SERVER_URL}/api/posts?tags=history,tech&sortBy=likes&direction=desc`);
      expect(status).to.equal(200)
      expect(response).to.deep.equal(mockHistoryTechLikesDesc.posts)
    });
  });


});