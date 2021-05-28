const express = require('express');
const router = express.Router();

const all_Pages = require('../controllers/all_Pages');

router.get('/', all_Pages.index);

router.get('/cities', all_Pages.app_page);

router.get('/cities/:cityname', all_Pages.detail_page);

module.exports = router;