const apiKey = require('../secret/weatherAPI');
const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = "http://api.openweathermap.org/data/2.5/forecast";

// Returns a promise of the request
const getWeather = (zipCode) => {
  const requestUrl = `${baseUrl}?zip=${encodeURIComponent(zipCode)}&APPID=${apiKey}`;

  return fetch(requestUrl, {method: 'get'})
    .then((res) => {
      if (!res.ok){
        console.log("Status not ok: ", res);
        throw new Error(res.status);
      }
      return res.json()
    });
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
  return moment.utc(dt, 'X').format('H:mm, MMM D');
}



function capitalizeFirstLetter(string){
  console.log('Before', string);
  const result = string.charAt(0).toUpperCase() + string.slice(1);
  console.log("After", result);
  return result;
}
//
const getRainyDays = (forecastList) => {
  const result = []
  for (let i = 0; i < forecastList.length; i += 2){
    const forecast = forecastList[i];
    const weather = forecast.weather[0];

    if (isRaining(weather.id)){
      const dateTime = moment.utc(forecast.dt, 'X');
      result.push({
        dateTime: dateTime,
        date: dateTime.format('MMM D'),
        time: dateTime.format('H:mm'),
        main: weather.main,
        description: capitalizeFirstLetter(weather.description),
      })
    }
  }

  return result;
}

exports.getRainyDays = getRainyDays;
exports.getWeather = getWeather;