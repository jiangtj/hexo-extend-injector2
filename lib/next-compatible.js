'use strict';

const points = require('./next-point');
const { resolve } = require('path');

module.exports = (ctx, injector) => {
  // Add injector2 to next_inject helper
  ctx.extend.helper.register('next_inject', function (point) {
    let nextInject = ctx.theme.config.injects[point]
      .map(item => this.partial(item.layout, item.locals, item.options))
      .join('');
    let injector2 = this.injector(point).text();
    if (point === 'head') {
      injector2 += this.injector('head-end').text();
    }
    return nextInject + injector2;
  });
  // Add injector2 to ctx.theme.config.injects
  ctx.extend.filter.register('before_generate', () => {
    let styleInjects = ctx.theme.config.injects;
    if (!styleInjects) return;
    points.styles.forEach(type => {
      styleInjects[type] = styleInjects[type].concat(
        injector.get(type).list().map(item => resolve(ctx.base_dir, item.value))
      );
    });
  }, Number.MAX_VALUE);
};
