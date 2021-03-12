'use strict';

require('chai').should();
const Injector = require('../../../lib/injector');
const Hexo = require('hexo');
const hexo = new Hexo();

describe('injector', () => {

  const injectorHelper = require('../../../lib/helper/injector');

  it('injector(point).text()', () => {
    const injector = new Injector(hexo);
    injector.register('body-start', 'xx');
    injector.register('head-start', 'ww');
    injector.register('head-end', 'cc');
    injector.register('body-end', 'a');
    injector.register('body end', 'b');
    injector.register('bodyend', 'c');
    injector.register('body_end', 'd');
    const result = injectorHelper(injector)('body-end').text();
    result.should.eql('abcd');
  });

});
