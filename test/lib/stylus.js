'use strict';

require('chai').should();
const Injector = require('../../lib/injector');
const stylus = require('stylus');

describe('stylus', () => {
  it('basic', () => {
    const injector = new Injector();
    injector.register('style', '../tmp/case1.styl');
    injector.register('style', '../tmp/case2.styl');
    const text = [
      '@import "../tmp/case-cc.styl"',
      'injector("no-exsit")',
      'title {color: #aaa}',
      'injector("style")'
    ].join('\n');
    stylus(text)
      .use(require('../../lib/stylus-helper')(__dirname, injector))
      .include(__dirname)
      .render((err, css) => {
        if (err) throw err;
        css.should.eql('title {\n  color: #aaa;\n}\n.book {\n  color: #eee;\n}\nbody {\n  color: #abc;\n}\n');
      });
  });
});
