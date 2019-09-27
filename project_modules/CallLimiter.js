/* Use time-based scheduling instead interval-based (setInterval())
since the intervals aren't exactly synced with realtime
ex: between 2 minutes, calls could "overflow" into the 2nd minute */
const schedule = require('node-schedule');

const CallLimiter = (maxCallsPerMin, errorMessage) => {
    // This makes sure the app won't go over the API limit (so i don't get charged)
    // Current plan has limit of 60 calls/min
    let callCount = 0
  
    const resetFunc = () => {
      callCount = 0;
    }
    schedule.scheduleJob('*/1 * * * *', resetFunc);
  
    // func doesn't take any args
    function executePromise(promiseFunc){  
      return new Promise((resolve, reject) => {
        if (callCount >= maxCallsPerMin) {    
          reject(Error(errorMessage));
        } else {
          callCount++;
          resolve(promiseFunc());
        }
      });
      
    }

    return {
      executePromise
    }
}

module.exports = CallLimiter;