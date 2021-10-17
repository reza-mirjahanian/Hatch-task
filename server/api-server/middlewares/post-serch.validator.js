const _ = require('lodash');
module.exports = (req, res, next) => {
    const {
        tags,
        sortBy = 'id',
        direction = 'asc'
    } = req.query;
    const tagsArray = (tags && _.isString(tags)) ? _.compact(tags.split(',')) : '';
    if (!_.isArray(tagsArray) || _.size(tagsArray) < 1) {
        res.status(400).send({
            error: 'Tags parameter is required'
        })
    }else if (!_.includes(['id', 'reads', 'likes', 'popularity'], sortBy) || !_.includes(['asc', 'desc'], direction)) {
        res.status(400).send({
            error: 'sortBy parameter is invalid'
        })
    }
    else {
        next()
    }
}
