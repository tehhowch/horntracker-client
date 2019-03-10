const data = require('./data');

exports.prepare = val => {
  val = val.trim().toLowerCase();
  return data.aliases[ val ] || val;
};

exports.prepareType = type => exports.prepare(type);

exports.prepareName = (type, name) => {
  type = exports.prepare(type)
  name = exports.prepare(name)

  switch (type) {
    case 'weapon':
      if (!name.endsWith('trap')) name += ' trap';
      break;
    case 'trinket':
      if (!name.endsWith('charm')) name += ' charm';
      break;
    case 'base':
    case 'cheese':
    case 'mouse':
      if (!name.endsWith(type)) name += ' ' + type;
      break;
  }

  return name;
}
