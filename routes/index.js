const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/weather');
});

// Default route
router.get('/weather', function(req, res, next) {
  res.render('index', { targetUrl: '/weather', selectedI: 0 });
});

router.post('/weather', weatherController.getRainy);

router.get('/rainy_days', (req, res, next) => {
  res.render('index', {targetUrl: '/rainy_days', selectedI: 1});
})

router.post('/rainy_days', weatherController.getCurrentWeather);

router.get('/email_alerts', (req, res, next) => {
  res.render('indev', {selectedI: 2});
})

module.exports = router;
