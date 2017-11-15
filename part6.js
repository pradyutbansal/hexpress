"use strict";

var hexpress = require('./hexpress');
var app = hexpress();

// GET / should respond with "Fourth time is the charm"
app.get('/', function(req, res, next) {
  next();
});

app.get('/', function(req, res, next) {
  next();
});

app.get('/', function(req, res, next) {
  next();
});

app.get('/', function(req, res) {
  res.send('Fourth time is the charm');
});

// GET /skippable should respond with "First skippable route"
// GET /skippable?skip=true should respond with "Second skippable route"
app.get('/skippable', function(req, res, next) {
  if (req.query.skip) {
    next();
  } else {
    res.send('First skippable route');
  }
});

app.get('/skippable', function(req, res) {
  res.send('Second skippable route');
});

// GET /notfound should respond with a 404 Not Found
app.get('/notfound', function(req, res, next) {
  next();
});

app.listen(3000);
