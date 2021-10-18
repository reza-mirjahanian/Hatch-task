'use strict';
const express = require('express'),
  constants = require('../constants'),
  PostRepo = require('../repository/Post'),
  blogService = require('../services/blog-api'),
  CacheService = require('../services/cache'),
  validateParams = require('./middlewares/post-serch.validator'),
  cors = require('cors'),
  logger = require('../utils/logger');

const app = express();
app.use(cors());
app.use(express.json());


const cache = new CacheService(constants.CACHE_TIME); // Create a new cache service instance

// Route 1:
app.get('/api/ping', (req, res) => res.send({
  "success": true
}));

// Route 2:
app.get('/api/posts', validateParams, async (req, res) => {
  try {
    const {
      tags,
      sortBy = 'id',
      direction = 'asc'
    } = req.query;

    //@todo maybe refactor to a controller
    const fetchDataWithCache = cache.wrap(blogService.run);
    const postRepo = new PostRepo(fetchDataWithCache);
    const allPosts = await postRepo.getPosts(tags.split(','));
    const sortedPosts = postRepo.mergePost(allPosts, {
      sortBy,
      direction
    })
    return res.status(200).send({
      posts: sortedPosts
    });

  } catch (err) {
    logger.error(req.path, {
      err: err.message
    });
    res.status(500).send({
      error: "Server Error"
    });
  }
});



app.listen(constants.EXPRESS_PORT, () => logger.log(`listening on port ${constants.EXPRESS_PORT}!`));
