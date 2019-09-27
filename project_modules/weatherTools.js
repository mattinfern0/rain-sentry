const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = "http://api.openweathermap.org/data/2.5/forecast";

const ApiMessenger = (() => {
  // This makes sure the app won't go over the API limit (so i don't get charged)
  // Current plan has limit of 60 calls/min
  const maxApiCallsPerMin = process.env.API_CALLS_PER_MIN || 50;
  console.log('max set to: ', maxApiCallsPerMin);
  let apiCallCount = 0

  const resetFunc = () => {
    console.log('Setting apiCallCount back to 0');
    apiCallCount = 0;
  }
  setInterval( resetFunc, 60000);

  // requestFunc doesn't take any args
  function doRequest(requestFunc){
    console.log('apiCallCount: ', apiCallCount);

    return new Promise((resolve, reject) => {
      if (apiCallCount >= maxApiCallsPerMin) {
        console.log(`apiCallCount ${apiCallCount} has reached the limit (${maxApiCallsPerMin} calls/min)`);
  
        reject(Error('API Call Limit Reached'));
      } else {
        apiCallCount++;
        resolve(requestFunc());
      }
    });
    
  }

  return {
    doRequest
  }

})();

// Returns a promise of the request
const getWeather = (zipCode) => {
  const weatherUnits = 'imperial'
  const requestUrl = `${baseUrl}?zip=${encodeURIComponent(zipCode)}&units=${weatherUnits}&APPID=${process.env.WEATHER_KEY}`;

  const requestFunc = () => {
    return fetch(requestUrl, {method: 'get'})
    .then((res) => {
      if (!res.ok){
        console.log("Status not ok: ", res);
        throw new Error(res.status);
      }
      return res.json()
    });
  }
  
  return ApiMessenger.doRequest(requestFunc);
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