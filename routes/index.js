var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user;
  if(req.session.passport)
    user = "přihlášený uživatel: " + req.session.passport.user.username;
  else
    user = "uživatel nepříhlášen";

  res.render('index', { title: 'Fed test', user : user });
});

module.exports = router;
