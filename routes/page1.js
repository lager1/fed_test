var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("route for page1");
  console.log(req.session);
  console.log(req.session.passport.user);
  res.send('page 1');
});

module.exports = router;
