'use strict';

require('chai').should();
const Injector = require('../../lib/injector');
const bundle = require('../../lib/bundle-utils');
const defaultConfig = require('../../lib/default-config');
const CleanCSS = require('clean-css');
const Hexo = require('hexo');
const { resolve } = require('path');

describe('bundler', () => {
  it('basic', () => {
    const injector = new Injector();
    injector.register('css', 'a{--color: #6f42c1;}');
    injector.register('css', { text: 'body {\n  color: #abc;\n}\n' });
    injector.register('css', resolve(__dirname, 'test1.css'));
    injector.register('css', { path: resolve(__dirname, 'test2.css') });
    const hexo = new Hexo();
    const config = defaultConfig.css;
    bundle(hexo, injector, 'css', ['.css', '.sass', '.styl']).then(source => {
      const output = new CleanCSS(config.options).minify(source);
      if (output.error) throw output.error;
      output.styles.should.eql('a{--color:#6f42c1}body{color:#abc}.book1{color:#0ff}.book2{color:#0ff}');
    });
  });
});
