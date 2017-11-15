"use strict";

var hexpress = require('./hexpress');
var app = hexpress();

// Simple route '/' that should replace the :fname and :lname
// params with alternative words and place them in req.params
app.get('/:fname/and/:lname', function(req, res) {
  res.json(req.params);
});


// Verify Your Solution:
// 1. Go to http://localhost:3000/prath/and/desai
// 2. You should see {"fname":"prath","lname":"desai"}
// 3. Go to http://localhost:3000/moose/and/paksoy
// 4. You should see {"fname":"moose","lname":"paksoy"}
//
// Make sure both work (to make sure original routes are being kept constant)

app.listen(3000);
