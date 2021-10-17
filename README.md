
### Node.JS Task
Reza Mirjahanian



#### Setup
- Node.JS 14 ( or later )
- Install dependencies `yarn` or `npm i`
- `npm start` - Runs project.
- `npm test` - Runs tests.
- `npm run coverage` - Runs code coverage.


[Route: /api/ping](http://localhost:3200/api/ping)

[Route: /api/posts](http://localhost:3200/api/posts?tags=history,tech&sortBy=likes&direction=desc)

###### Errors
[Tags parameter is required](http://localhost:3200/api/posts?tags=&sortBy=likes&direction=desc)

[sortBy parameter is invalid 1](http://localhost:3200/api/posts?tags=tech&sortBy=price&direction=desc)

[sortBy parameter is invalid 2](http://localhost:3200/api/posts?tags=tech&sortBy=id&direction=descjjj)


#### Assumptions
- ✅ Default Port is 3200 (constants.js)

#### Todo
- 💡 Improve Testing
