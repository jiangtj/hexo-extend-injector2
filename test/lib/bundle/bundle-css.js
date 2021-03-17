'use strict';

require('chai').should();
const Hexo = require('hexo');
const Injector = require('../../../lib/injector');
const cssGenerator = require('../../../lib/bundle/css-generator');
const { resolve } = require('path');

describe('CSS Bundler', () => {
  it('basic', () => {
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    require('../../../lib/bundle/css-bundle')(hexo, injector);
    injector.register('css', 'a{--color: #6f42c1;}');
    injector.register('css', 'body {\n  color: #abc;\n}\n');

    injector.get('headend').text().should.eql('<link rel="stylesheet" type="text/css" href="/css/injector/main.css" />');
    const exec = cssGenerator(injector, 'default');
    const result = exec();
    result.should.eql('a{--color:#6f42c1}body{color:#abc}');
  });

  it('v0.2 scheme', () => {
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    require('../../../lib/bundle/css-bundle')(hexo, injector);
    injector.register('css', { path: resolve(__dirname, 'test.css') });
    injector.register('css', { text: () => 'body {\n  color: #abc;\n}\n' });
    const exec = cssGenerator(injector, 'default');
    const result = exec();
    result.should.eql('.book1{color:#0ff}body{color:#abc}');
  });

});
