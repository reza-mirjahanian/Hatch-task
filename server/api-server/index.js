'use strict';
const express = require('express'),
  constants = require('../constants'),
  _ = require('lodash'),
    PostRepo = require('../repository/Post'),

  cors = require('cors'),
  logger = require('../utils/logger');

const app = express();
app.use(cors());
app.use(express.json());


// Route 1:
app.get('/api/ping', (req, res) => res.send({
      "success": true
    }
));

// Route 2:
app.get('/api/posts', async (req, res) => {
  try {
    const {tags,sortBy = 'id',direction = 'asc'} = req.query;
    const postRepo = new PostRepo();
    const tagsArray = _.compact(tags.split(','));
    const allPosts = await postRepo.getPosts(tagsArray);
    const output = postRepo.mergePost(allPosts,{sortBy,direction})
    return res.status(200).send(output);
  } catch (err) {
    logger.error(req.path, {
      err
    });
    res.status(400).send({
      error: err.message
    });

  }
});



app.listen(constants.EXPRESS_PORT, () => logger.log(`listening on port ${constants.EXPRESS_PORT}!`));
