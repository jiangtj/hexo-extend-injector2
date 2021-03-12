'use strict';

module.exports = ctx => point => {
  const nextInject = ctx.theme.config.injects[point]
    .map(item => ctx.partial(item.layout, item.locals, item.options))
    .join('');
  let injector2 = ctx.injector(point).text();
  if (point === 'head') {
    injector2 += ctx.injector('head-end').text();
  }
  return nextInject + injector2;
};
