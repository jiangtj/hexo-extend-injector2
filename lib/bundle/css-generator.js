'use strict';

const CleanCSS = require('clean-css');

module.exports = (injector, env, options) => () => {
  const source = injector.get('css', { env }).text('\n');
  const output = new CleanCSS(options).minify(source);
  if (output.error) throw output.error;
  return output.styles;
};
