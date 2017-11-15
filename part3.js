"use strict";

var hexpress = require('./hexpress');
var app = hexpress();

// this endpoint sends back "Hexpress v1.0" to every request method
app.use('/api/version', function (req, res) {
  res.send('Hexpress v1.0');
});

// this endpoint should not be reachable because it shares a prefix with the previous URL
app.use('/api/version/2', function (req, res) {
  res.send('Hexpress v2.0');
});

// thie endpoint responds to GET /api with "API is online"
app.get('/api', function (req, res) {
  res.send('API is online');
});

// thie endpoint responds to GET/POST /api with the current time
app.use('/api', function (req, res) {
  res.send('Current time is ' + new Date());
});

// catch-all endpoint that responds all requests that do not match previous requests.
app.use(function(req, res) {
  res.send('Not found');
});

// Verify Your Solution:
// 1. run this file
// 2. use Postman to make GET/POST requests to http://localhost:3000/api/version verify it returns `Hexpress v1.0`
// 3. use Postman to make GET/POST requests to http://localhost:3000/api/version/2 verify it STILL returns `Hexpress v1.0`
// 4. use Postman to make a GET request to http://localhost:3000/api, verify it returns `API is online`
// 5. use Postman to make a POST request to http://localhost:3000/api, verify it returns `Current time is ...`
// 6. use Postman to make GET/POST requests to http://localhost:3000/nosuch or any other URL, verify it returns `Not found`

app.listen(3000);
