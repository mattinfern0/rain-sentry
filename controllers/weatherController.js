const { check,validationResult, sanitizeBody } = require('express-validator');
const weatherTools = require('../project_modules/weatherTools');

exports.getCurrentWeather = [
  check('zipcode').isLength({min: 5, max: 5}).isNumeric(),

  (req, res, next) => {
    res.locals.selectedI = 0;
    res.locals.targetUrl = '/weather'
    res.locals.pageTitle = 'Current Weather'

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Not a valid zipcode');
      res.render('index');
    }
    sanitizeBody('zipcode').escape();

    const zipCode = req.body.zipcode;
    weatherTools.getWeather(zipCode)
      .then((data) => {
        const locationName = data.city.name;
        const weatherInfo = weatherTools.getTodayForecast(data.list);

        res.render('index', {locationName: locationName, weatherInfo : weatherInfo});
      })
      .catch((err) => {
        console.log('Error while getting rainy days: ', err);
        let errorMessage = 'Sorry! Something weird went wrong!';
    
        if (err.message === '404'){
            errorMessage = 'Couldn\'t find weather data for this location';
        } else if (err.message === 'invalid zipcode'){
            errorMessage = 'Invalid zipcode'
        } else if (err.message === 'API Call Limit Reached') {
            errorMessage = 'The server is busy. Try again in 1 minute'
        }
    
        req.flash('error', errorMessage);
        res.render('index');
      });
  }
]; 
  
exports.getRainy = [
    check('zipcode').isLength({min: 5, max: 5}).isNumeric(),

    (req, res, next) => {
      res.locals.selectedI = 1;
      res.locals.targetUrl = '/rainy_forecast';
      res.locals.pageTitle = 'Rainy Forecast';

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', 'Not a valid zipcode');
        res.render('index');
      }
      sanitizeBody('zipcode').escape();

      const zipCode = req.body.zipcode;
      weatherTools.getWeather(zipCode)
        .then((data) => {
          const locationName = data.city.name;
          const rainyDays = weatherTools.getRainyDays(data.list);

          res.render('index', {locationName: locationName, rainyDays: rainyDays});
        })
        .catch((err) => {
          console.log('Error while getting weather: ', err);
          let errorMessage = 'Sorry! Something weird went wrong!';

          if (err.message === '404'){
            errorMessage = 'Couldn\'t find weather data for this location';
          } else if (err.message === 'invalid zipcode'){
            errorMessage = 'Invalid zipcode'
          } else if (err.message === 'API Call Limit Reached') {
            errorMessage = 'The server is busy. Try again in 1 minute'
          }

          req.flash('error', errorMessage);
          res.render('index');
        });
    } 
];