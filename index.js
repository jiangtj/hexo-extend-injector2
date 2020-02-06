'use strict';

const Injector = require('./lib/injector');
const { Cache } = require('hexo-util');
const cache = new Cache();

const initInjector = ctx => {
  if (ctx.extend.injector2) {
    return ctx.extend.injector2;
  }

  const injector = new Injector();
  ctx.extend.injector2 = injector;
  ctx.on('generateBefore', () => {
    injector.clean();
  });

  const { helper, filter } = ctx.extend;

  helper.register('injector', function (point) {
    cache.set(`${injector.formatKey(point)}`, true);
    return injector.get(point, { context: this });
  });

  if (!ctx.config.disable_injector2_default_point) {
    filter.register('after_route_render', require('./lib/filter')(ctx, cache));
  }

  injector.loadStylusPlugin = () => require('./lib/stylus')(ctx, filter, injector);
  injector.loadNexTPlugin = () => require('./lib/next')(filter, injector);

  return injector;
}

module.exports = initInjector;
