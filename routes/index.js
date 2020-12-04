var express = require('express');
var router = express.Router();




const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect("/users/login");
  }
  return next();
};


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'a/A Express Skeleton Home' });

});

module.exports = router;
