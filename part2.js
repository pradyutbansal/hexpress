"use strict";

var hexpress = require('./hexpress');
var app = hexpress();

// Use POSTMAN to make a POST request to localhost:3000/login with body
//  - username: your-username
//  - password: your-password
//
// This route will respond with status 200 and the
// JSON object {method: 'post', username: req.body.username, password: req.body.password}
// where req.body.username will be the username posted to the endpoint
// and req.body.password will be the password posted to the endpoint
app.post('/login', function(req, res) {
  res.json({
    method: 'post',
    username: req.body.username,
    password: req.body.password
  });
});

// Use POSTMAN to make a GET request to localhost:3000/login?username=moose&password=prath
//
// This route will respond with status 200 and the
// JSON object {method: true, username: 'moose', password: 'prath'}
app.get('/login', function(req, res) {
  res.json({
    success: true,
    username: req.query.username,
    password: req.query.password
  });
});

app.listen(3000);
