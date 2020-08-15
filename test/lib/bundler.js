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
    return bundle(hexo, injector, 'css', ['.css', '.sass', '.styl']).then(source => {
      const output = new CleanCSS(config.options).minify(source);
      if (output.error) throw output.error;
      output.styles.should.eql('a{--color:#6f42c1}body{color:#abc}.book1{color:#0ff}.book2{color:#0ff}');
    });
  });

  it('lazyload', () => {
    const injector = new Injector();
    injector.register('js', () => 'var a=1;');
    injector.register('js', { text: () => 'var b=1;' });
    const hexo = new Hexo();
    return bundle(hexo, injector, 'js').then(source => {
      source.should.eq('var a=1;\nvar b=1;');
    });
  });

  it('locals', () => {
    const injector = new Injector();
    injector.register('js', { text: ctx => JSON.stringify(ctx.config) });
    const hexo = new Hexo();
    return bundle(hexo, injector, 'js').then(source => {
      source.should.eq(JSON.stringify(hexo.config));
    });
  });
});
