var express = require('express');
var router = express.Router();

const all_Pages = require('../controllers/all_Pages');

router.get('/cities', all_Pages.index);

router.get('/cities/:cityname,:countrycode&units=:unit', all_Pages.detail_page);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/cities');
});

module.exports = router;
