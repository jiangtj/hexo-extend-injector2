'use strict';

module.exports = point => {
  const nextInject = this.theme.config.injects[point]
    .map(item => this.partial(item.layout, item.locals, item.options))
    .join('');
  let injector2 = this.injector(point).text();
  if (point === 'head') {
    injector2 += this.injector('head-end').text();
  }
  return nextInject + injector2;
};
