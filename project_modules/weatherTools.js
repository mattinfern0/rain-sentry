const apiKey = require('../secret/weatherAPI');
const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = "http://api.openweathermap.org/data/2.5/forecast";

// Returns a promise of the request
const getWeather = (zipCode) => {
  const weatherUnits = 'imperial'
  const requestUrl = `${baseUrl}?zip=${encodeURIComponent(zipCode)}&units=${weatherUnits}&APPID=${apiKey}`;

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

function capitalizeFirstLetter(string){
  console.log('Before', string);
  const result = string.charAt(0).toUpperCase() + string.slice(1);
  console.log("After", result);
  return result;
}

// if getLarge is true, gets the bigger version of the icon
function getIconUrl(iconCode, getLarge=false){
  return `https://openweathermap.org/img/wn/${iconCode}${getLarge ? '@2x' : ''}.png`
}

// Gets all the relevant info from the response object 
const getTodayForecast = (forecastList) => {
  const todayForecast = forecastList[0];
  const result = {
    weather: {
      name: capitalizeFirstLetter(todayForecast.weather[0].main),
      description: capitalizeFirstLetter(todayForecast.weather[0].description),
      iconUrl: getIconUrl(todayForecast.weather[0].icon, true),
    },
    tempCurrent: todayForecast.main.temp,
    tempMin: todayForecast.main.temp_min,
    tempMax: todayForecast.main.temp_max,
  }
  console.log("Forecast info: ", result);
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
        iconUrl: getIconUrl(weather.icon),
      })
    }
  }

  return result;
}

exports.getRainyDays = getRainyDays;
exports.getWeather = getWeather;
exports.getTodayForecast = getTodayForecast;