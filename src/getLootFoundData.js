const request = require('./rawRequest');
const vars = require('./vars');

const defaults = {
  'min-chance': 0,
  'min-qty': 0,
};

module.exports = function (setup, opts) {
  if (!setup) throw new Error('missing setup!')
  opts = Object.assign({}, defaults, opts || {});

  setup = vars(setup);

  return Promise
    .resolve(setup)
    .then(setup => ({ f: 'getLootFoundData', vars: setup }))
    .then(request.bind(request, opts))
    .then(data => {
      if (!data.loot) throw new Error('no loot in response');
      const sample = +data.totalCaught;
      const res = data.loot
        .map(loot => {
          const dropTimes = +loot.dropped;
          const quantity = +loot.quant;
          return {
            id: +loot.lid,
            name: loot.name,
            chance: dropTimes / sample,
            total: quantity,
            avgPerCatch: quantity / sample,
            avgPerDrop: quantity / dropTimes,
            sample: sample
          }
        })
        .filter(loot => {
          return loot.chance >= opts[ 'min-chance' ] && loot.avgPerCatch >= opts[ 'min-qty' ]
        })
        .sort((a, b) => b.chance - a.chance);
      return res;
    });
}

module.defaults = defaults;
