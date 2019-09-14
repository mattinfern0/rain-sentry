const apiKey = require('../secret/weatherAPI');
const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = "http://api.openweathermap.org/data/2.5/forecast";

// Returns a promise of the request
function getWeather(zipCode){
  const requestUrl = `${baseUrl}?zip=${encodeURIComponent(zipCode)}&APPID=${apiKey}`;

  return fetch(requestUrl, {method: 'get'})
    .then((res) => {
      if (!res.ok){
        throw new Error(res.status);
      }
      return res.json()
    }).catch((err) => {
      console.log("Error while getting weather: ", err);
      return null;
    })
}

// Range includes min/max
function inRange(num, min, max){
  return min <= num && num <= max;
}

function isRaining(weatherCode){
  return (inRange(weatherCode, 200, 299)
    || inRange(weatherCode, 300, 399)
    || inRange(weatherCode, 500, 599));
}

function parseDT(dt){
  return moment.utc(dt, 'X').format('H:mm, MMM D YYYY');
}

function getRainyDays(forecastList){
  const result = []
  for (let i = 0; i < forecastList.length; i += 2){
    let forecast = forecastList[i];
    let weather = forecast.weather[0];
    if (isRaining(weather.id)){
      result.push({
        dt: forecast.dt,
        parsedTime: parseDT(forecast.dt),
        main: weather.main,
        description: weather.description,
      })
    }
  }

  return result;
}

exports.sendRainy = (req, res, next) => {
  const zipCode = req.body.zipcode;
  console.log(zipCode);
  getWeather(zipCode).then((data) => {
    const rainyDays = getRainyDays(data.list);
    res.render('rainy', {title: 'Test Page',rainyDays: rainyDays});
  }).catch((err) => {
    console.log('Error while getting rainy days: ', err);
    return next(err);
  })
}