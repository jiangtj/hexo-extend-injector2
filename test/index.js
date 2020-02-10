'use strict';

const Hexo = require('hexo');
const hexo = new Hexo(__dirname, { silent: true });

describe('main', () => {
  require('./lib/injector');
});
