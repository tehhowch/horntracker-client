const debug = require('debug')('ht:pop');
const request = require('./rawRequest');
const vars = require('./vars');

const defaults = {
  attraction: 0,
  confidence: 0
};

module.exports = (setup, opts) => {
  if (!setup) throw new Error('missing setup!');
  opts = Object.assign({}, defaults, opts || {});

  setup = vars(setup);

  return Promise
    .resolve(setup)
    .then(setup => ({ f: 'getSAEncounterRateData', vars: setup }))
    .then(request.bind(request, opts))
    .then(data => {
      if (!data.mice) throw new Error('no mice in response');
      const sample = +data.huntCount;
      let total = 0;
      let filtered = 0;
      let filteredSeen = 0;
      const res = data.mice
        .map(mice => {
          const seen = +mice.seen;
          const ar = seen / sample;
          const error = +mice.sError;
          return {
            mouse: mice.name.replace(/ Mouse$/, ''),
            attraction: ar,
            seen: seen,
            error: error / ar,
            sample: sample
          };
        })
        .filter(mice => {
          let filter = false;
          if (opts.confidence > 0 && mice.error > 1 / opts.confidence) filter = true;
          if (opts.attraction > 0 && mice.seen / sample < opts.attraction) filter = true;
          if (filter) {
            filtered++;
            filteredSeen += mice.seen;
            return false;
          }
          total += +mice.seen;
          return true;
        })
        .map(mice => {
          // correct attraction due to filtering
          mice.attraction = mice.seen / total;
          return mice;
        })
        .sort((a, b) => b.attraction - a.attraction);
      debug('filtered %d mice with total pop %d%%', filtered, Math.round(filteredSeen / sample * 10000) / 100);
      return res;
    });
}

module.defaults = defaults;
