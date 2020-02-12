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
      'title {color: #aaa}\n',
      'injector(\'style\')\n'
    ].join('\n');
    stylus(text)
      .use(require('../../lib/stylus')(__dirname, injector))
      .include(__dirname)
      .render((err, css) => {
        if (err) throw err;
        css.should.eql('title {\n  color: #aaa;\n}\n.book {\n  color: #eee;\n}\nbody {\n  color: #abc;\n}\n');
      });
  });
});
