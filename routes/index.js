var express = require('express');
var router = express.Router();
const weatherController = require('../controllers/weatherController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/rainy_days', weatherController.sendRainy);

router.get('/email_alerts', (req, res, next) => {
  res.render('indev');
})

module.exports = router;
