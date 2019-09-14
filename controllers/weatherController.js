const apiKey = require('../secret/weatherAPI');
const fetch = require('node-fetch');

const baseUrl = "http://api.openweathermap.org/data/2.5/forecast";

// Returns promise of the request
function getWeather(zipCode){
  // Remove key later
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

getWeather(92831).then((data) => {
  const forecastList = data.list;
  console.log('Num of forecasts: ', forecastList.length);
  console.log('The forecasts: ', forecastList);
})