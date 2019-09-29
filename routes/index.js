const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/weather');
});

// Default route
router.get('/weather', function(req, res, next) {
  res.render('index', { targetUrl: '/weather', selectedI: 0, pageTitle: 'Current Weather' });
});

router.post('/weather', weatherController.getRainy);

router.get('/rainy_forecast', (req, res, next) => {
  res.render('index', {targetUrl: '/rainy_forecast', selectedI: 1, pageTitle: 'Rainy Forecast'});
})

router.post('/rainy_forecast', weatherController.getCurrentWeather);

router.get('/email_alerts', (req, res, next) => {
  res.render('indev', {selectedI: 2});
})

module.exports = router;
