'use strict';

// eslint-disable-next-line node/no-unpublished-require
const { nodes } = require('stylus');
const { resolve } = require('path');

module.exports = (baseDir, injector) => style => {
  style.define('injector', data => {
    const block = new nodes.Block();
    const list = injector.get(data.val).list()
      .map(item => resolve(baseDir, item.value))
      .map(item => new nodes.String(item))
      .map(item => item.toExpression())
      .map(item => new nodes.Import(item));
    list.forEach(element => block.push(element));
    return block;
  });
};
