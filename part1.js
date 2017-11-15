"use strict";

var hexpress = require('./hexpress');
var app = hexpress();

// Simple route should send the text 'First endpoint!'
// as the response. The content type header should be
// set to text/plain.
app.get('/', function(req, res) {
  res.send('First endpoint! #works :)');
});

// This route should never be called.
// Visiting / should execute the previous route.
app.get('/', function(req, res) {
  res.send('Ignored :(');
});

// This route should send all of the query parameters
// back as a JSON string.
// Response type should be application/json
app.get('/query', function(req, res) {
  res.json(req.query);
});

app.get('/prdyut', function(req,res){

})
app.get('/moose', function(req,res){

})
// TEST req.query:
// Navigate to http://localhost:3000/query?hello=3&yolo=12345678
// You should see {"hello":"3","yolo":"12345678"}

app.listen(3000);
