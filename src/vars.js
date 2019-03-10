const getIdFromName = require('./getIdFromName');
const debug = require('debug')('ht:vars')

// Convert the setup's vars strings into an HT API-compatible JSON object.
// `setup` is an object with keys from --vars & --no-vars, whose values are nested
// objects whose values are their sub-keys. i.e.
/* {
 *   charm: { "grub scent": true, "shattering": true },
 *   location: {
 *     "sand crypts": {
 *       "grub salt": { 1: true }
 *     }
 *   }
 * }
 */
module.exports = setup => {
  debug('step 1', setup);
  return Promise
    .all(Object.entries(setup).map(([type, names]) => {
      debug("step 2", type, names);
      // For each value in names, get the HT ID associated with it.
      return Promise.all(Object.entries(names).map(([name, values]) => {
        debug("step 3", name, values);
        return getIdFromName(type, name, {})
          .then(result => {
            // Set the exclude option if requested.
            const v = (values !== null && typeof values === 'object') ?
              values : ({exclude: !values});
            return {id: result.id, name: name, values: v};
          });
      }))
      .then(nameObjects => Object.assign({}, ...nameObjects.map(item => ({[item.id]: item.values}))))
      .then(nameDict => ({[type]: nameDict}));
    }))
    // Return an object instead of an array.
    .then(typeObjects => Object.assign({}, ...typeObjects));
}
