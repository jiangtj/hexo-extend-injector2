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
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    injector.register('css', 'a{--color: #6f42c1;}');
    injector.register('css', { text: 'body {\n  color: #abc;\n}\n' });
    injector.register('css', resolve(__dirname, 'test1.css'));
    injector.register('css', { path: resolve(__dirname, 'test2.css') });
    const config = defaultConfig.css;
    return bundle(hexo, injector, 'css', ['.css', '.sass', '.styl']).then(source => {
      const output = new CleanCSS(config.options).minify(source);
      if (output.error) throw output.error;
      output.styles.should.eql('a{--color:#6f42c1}body{color:#abc}.book1{color:#0ff}.book2{color:#0ff}');
    });
  });

  it('lazyload', () => {
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    injector.register('js', () => 'var a=1;');
    injector.register('js', { text: () => 'var b=1;' });
    return bundle(hexo, injector, 'js', ['.js']).then(source => {
      source.should.eq('var a=1;\nvar b=1;');
    });
  });

  it('promise', () => {
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    injector.register('js', { value: Promise.resolve('var a=1;') });
    injector.register('js', { text: Promise.resolve('var b=1;') });
    return bundle(hexo, injector, 'js', ['.js']).then(source => {
      source.should.eq('var a=1;\nvar b=1;');
    });
  });

  it('locals', () => {
    const hexo = new Hexo();
    const injector = new Injector(hexo);
    injector.register('js', { text: ctx => JSON.stringify(ctx.config) });
    return bundle(hexo, injector, 'js').then(source => {
      source.should.eq(JSON.stringify(hexo.config));
    });
  });
});
