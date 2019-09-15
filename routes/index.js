const express = require('express');
const router = express.Router();
const weatherTools = require('../project_modules/weatherTools');

const { check,validationResult, sanitizeBody } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/weather');
});

// Default route
router.get('/weather', function(req, res, next) {
  res.render('index', { targetUrl: '/', selectedI: 0 });
});

router.get('/rainy_days', (req, res, next) => {
  res.render('index', {targetUrl: '/rainy_days', selectedI: 1});
})

router.post('/rainy_days', [
    check('zipcode').isLength({min: 5, max: 5}).isNumeric(),
  ], (req, res, next) => {
    res.locals.selectedI = 1;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Not a valid zipcode');
      res.render('index', {targetUrl: '/rainy_days'});
    }
    sanitizeBody('zipcode').escape();
    const zipCode = req.body.zipcode;
    console.log(zipCode);

    weatherTools.getWeather(zipCode).then((data) => {
      const locationName = data.city.name;
      const rainyDays = weatherTools.getRainyDays(data.list);

      res.render('index', {locationName: locationName, title: 'Test Page', targetUrl: '/rainy_days', rainyDays: rainyDays});
    }).catch((err) => {
      console.log('Error while getting rainy days: ', err);
      let errorMessage = 'Sorry! Something weird went wrong!';

      if (err.message === '404'){
        errorMessage = 'Couldn\'t find weather data for this location';
      } else if (err.message === 'invalid zipcode'){
        errorMessage = 'Invalid zipcode'
      }

      req.flash('error', errorMessage);
      res.render('index', {targetUrl: '/rainy_days'});
    });
}); 

router.get('/email_alerts', (req, res, next) => {
  res.render('indev', {selectedI: 2});
})

module.exports = router;
