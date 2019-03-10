const request = require('request')
const data = require('./data')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function doRequest(config) {
  return new Promise((resolve, reject) => {
    request(config, (err, response, body) => {
      if (err) {
        console.error({message:"HT API request error", err, response: (response ? response.toJSON() : null)});
        reject(err);
      } else if (response && response.statusCode === 200) {
        resolve(body);
      } else {
        console.error(response ? response.toJSON() : "Unknown response");
        reject(body);
      }
    });
  });
}

module.exports = (opts, payload) => {
  if (!payload) {
    [payload, opts] = [opts, {}];
  }
  const config = {
    method: "POST",
    url: data.ENDPOINT,
    json: true,
    body: payload
  };
  return doRequest(config)
    .catch(err => {
      return (opts.retry) ? delay(30000).then(() => doRequest(config)) : err;
    });
}
