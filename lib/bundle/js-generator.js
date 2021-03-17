'use strict';

const { minify } = require('terser');

module.exports = (injector, options) => () => {
  const source = injector.get('js').text('\n');
  return minify(source, options)
    .then(result => result.code);
};
