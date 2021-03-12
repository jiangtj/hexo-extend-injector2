'use strict';

const Hexo = require('hexo');
// eslint-disable-next-line no-unused-vars
const hexo = new Hexo(__dirname, { silent: true });

describe('main', () => {
  require('./lib/injector');
  require('./lib/bundler');
  require('./lib/hexo-compatible');
  describe('helper', () => {
    require('./lib/helper/injector');
    require('./lib/helper/next-inject');
  });
});
