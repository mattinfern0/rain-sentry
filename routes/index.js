const express = require('express');
const router = express.Router();
const weatherTools = require('../project_modules/weatherTools');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { targetUrl: '/', selectedI: 0 });
});

router.get('/rainy_days', (req, res, next) => {
  res.render('index', {targetUrl: '/rainy_days', selectedI: 1});
})

router.post('/rainy_days', (req, res, next) => {
  const zipCode = req.body.zipcode;
  console.log(zipCode);

  weatherTools.getWeather(zipCode).then((data) => {
    const rainyDays = weatherTools.getRainyDays(data.list);
    res.render('index', {title: 'Test Page', targetUrl: '/rainy_days', rainyDays: rainyDays, selectedI: 1});
  }).catch((err) => {
    console.log('Error while getting rainy days: ', err);
    let errorMessage = 'Sorry! Something weird went wrong!';
    if (err.message === '404'){
      errorMessage = 'Couldn\'t find weather data for this location';
    }

    req.flash('error', errorMessage);
    res.render('index', {targetUrl: '/rainy_days', selectedI: 1});
  });
}); 

router.get('/email_alerts', (req, res, next) => {
  res.render('indev', {selectedI: 2});
})

module.exports = router;
