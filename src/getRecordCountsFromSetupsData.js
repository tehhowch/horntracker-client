const debug = require('debug')('ht:pop')
const request = require('./rawRequest')
const utils = require('./utils')
const vars = require('./vars')

const aliases = {
  trap: 'weapon',
  trinket: 'charm'
}

const defaults = {
  min: 0,
  target: 'weapon'
}

module.exports = (setup, opts) => {
  if (!setup) throw new Error('missing setup!');
  opts = Object.assign({}, defaults, opts || {});

  setup = vars(setup);

  let target = utils.prepareType(opts.target);
  if (target in aliases) target = aliases[ target ];

  return Promise
    .resolve(setup)
    .then(setup => ({
        f: 'getRecordCountsFromSetupsData',
        vars: setup,
        target: {
          name: target,
          min: opts.min
        }
      })
    )
    .then(request.bind(request, opts))
    .then(res => res.targets );
}

module.defaults = defaults;
