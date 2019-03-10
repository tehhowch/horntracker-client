const ht = require('../');
const output = require('./options/output');
const vars = require('./options/vars');

exports.command = 'top';
exports.describe = 'display top trap setups';
exports.builder = yargs => {
  return yargs
    .options(output.options)
    .options(vars.options);
}

exports.handler = argv => {
  vars.handler(argv);
  ht.getTopTrapSetups(argv.vars, argv)
    .then(output.handler.bind(output, argv))
    .catch(console.error.bind(console));
}
