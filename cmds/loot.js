const ht = require('../');
const output = require('./options/output');
const vars = require('./options/vars');

exports.command = 'loot';
exports.describe = 'display loot drops for setup';
exports.builder = yargs => {
  return yargs
    .options(output.options)
    .options(vars.options)
    .option('min-chance', {
      coalesce: val => val / 100,
      default: 0,
      defaultDescription: '(0%)',
      description: 'Minimum chance to include loot in results',
      number: true,
      requiresArg: true
    })
    .option('min-qty', {
      default: 0,
      description: 'Minimum average quantity per catch to include loot in results',
      number: true,
      requiresArg: true
    });
}

exports.handler = argv => {
  vars.handler(argv);
  if (argv.verbose) console.log(argv);
  ht.getLootFoundData(argv.vars, argv)
    .then(output.handler.bind(output, argv))
    .catch(console.error.bind(console));
}
