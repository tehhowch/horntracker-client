const debug = require('debug')('ht:loot');
const request = require('./rawRequest');
const vars = require('./vars');

const defaults = {};

module.exports = (setup, opts) => {
  if (!setup) throw new Error('missing setup!');
  opts = Object.assign({}, defaults, opts || {});

  setup = vars(setup);

  return Promise
    .resolve(setup)
    .then(setup => ({ f: 'getTopTrapSetups', vars: setup }))
    .then(request.bind(request, opts))
    .then(data => {
      if (!data.toptraps) throw new Error('no toptraps in response')
      return data.toptraps;
    });
}

module.defaults = defaults;
