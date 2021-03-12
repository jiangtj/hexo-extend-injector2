'use strict';

require('chai').should();
const Injector = require('../../../lib/injector');
const Hexo = require('hexo');
const hexo = new Hexo();
const nextInjectHelper = require('../../../lib/helper/next-inject');

hexo.theme.config = {
  injects: {
    'head': [],
    'header': [],
    'sidebar': [],
    'postMeta': [],
    'postBodyEnd': [],
    'footer': [],
    'bodyEnd': [],
    'comment': []
  }
};

describe('next-inject', () => {

  it('next_inject(point)', () => {
    const injector = new Injector(hexo);
    injector.register('body-start', 'xx');
    injector.register('head-start', 'ww');
    injector.register('head-end', 'cc');
    injector.register('body-end', 'a');
    injector.register('body end', 'b');
    injector.register('bodyend', 'c');
    injector.register('body_end', 'd');
    const result = nextInjectHelper(injector, hexo)('bodyEnd');
    result.should.eql('abcd');
  });

  it('use next_inject(point) in home', () => {
    const injector = new Injector(hexo);
    injector.register('body-end', 'a');
    injector.register('body-end', 'b', 'home');
    injector.register('body-end', 'v', injector.is('post'));
    const result = nextInjectHelper(injector, Object.assign({page: {__index: true}}, hexo))('bodyEnd');
    result.should.eql('ab');
  });

  it('use next_inject(point) in post', () => {
    const injector = new Injector(hexo);
    injector.register('body-end', 'a');
    injector.register('body-end', 'b', 'home');
    injector.register('body-end', 'v', injector.is('post'));
    const result = nextInjectHelper(injector, Object.assign({page: {__post: true}}, hexo))('bodyEnd');
    result.should.eql('av');
  });

  it('next_inject(head) include head and head-end', () => {
    const injector = new Injector(hexo);
    injector.register('head', 'a');
    injector.register('body-end', 'b');
    injector.register('head-end', 'c');
    const result = nextInjectHelper(injector, Object.assign({page: {__post: true}}, hexo))('head');
    result.should.eql('ac');
  });

});
