var express = require('express');
var router = express.Router();
const weatherController = require('../controllers/weatherController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/rainydays', weatherController.sendRainy);

module.exports = router;
