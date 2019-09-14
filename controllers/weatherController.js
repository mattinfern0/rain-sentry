const weatherTools = require('../project_modules/weatherTools');

exports.sendRainy = (req, res, next) => {
  const zipCode = req.body.zipcode;
  console.log(zipCode);
  weatherTools.getWeather(zipCode).then((data) => {
    const rainyDays = weatherTools.getRainyDays(data.list);
    res.render('rainy', {title: 'Test Page',rainyDays: rainyDays});
  }).catch((err) => {
    console.log('Error while getting rainy days: ', err);
    return next(err);
  });
}