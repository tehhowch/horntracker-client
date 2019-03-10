const request = require('./rawRequest');
const data = require('./data');
const utils = require('./utils');
const htmenu = require('../cache/htmenu');

module.exports = (type, name, opts) => {
  if (!type) throw new Error('missing type!');
  if (!name) throw new Error('missing name!');

  // if we are asked for id instead of name, just return it
  if (!Number.isNaN(+name)) return Promise.resolve({ id: +name });

  type = utils.prepareType(type);
  name = utils.prepareName(type, name);

  return new Promise((resolve, reject) => {
    // first try with the short cache.
    const cachedDataType = data.cached[ type ];
    if (cachedDataType && cachedDataType.hasOwnProperty(name)) {
      resolve({id: cachedDataType[name]});
      return;
    }

    // then try with the htmenu cache
    for (const field of htmenu) {
      const cacheType = utils.prepareType(field.name);
      if (cacheType === type) {
        for (const item of field.data) {
          const cacheName = utils.prepareName(type, item.name);
          if (cacheName === name) {
            resolve({id: item.value});
            return;
          }
        }
        break;
      }
    }

    // Item was not in cache, query for it.
    console.warn(`Can't find cached id for ${type} / ${name} -- querying HT.`);
    request(opts, {
      f: "getIdFromName",
      vars: {
        type, name
      }
    }).then(body => {
      if (body && body.id) {
        body.id = +body.id;
      }
      resolve(body);
    });
  });
}
