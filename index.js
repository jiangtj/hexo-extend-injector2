'use strict';

const Injector = require('./lib/injector');
const { resolve } = require('path');
const { Cache } = require('hexo-util');
const cache = new Cache();

const initInjector = ctx => {
  // If initialized, return the result
  if (ctx.extend.injector2) {
    return ctx.extend.injector2;
  }

  // If not in the main plugin directory, relocate to the main plugin directory
  const main = resolve(ctx.plugin_dir, 'hexo-extend-injector2');
  if (main !== __dirname) {
    return require(main)(ctx);
  }

  // Init
  const injector = new Injector();
  ctx.extend.injector2 = injector;
  ctx.on('generateBefore', () => {
    injector.clean();
  });

  const { helper, filter } = ctx.extend;

  // Set injector helper
  helper.register('injector', function(point) {
    cache.set(`${injector.formatKey(point)}`, true);
    return injector.get(point, { context: this });
  });

  // Set default injection point
  if (!ctx.config.disable_injector2_default_point) {
    filter.register('after_route_render', require('./lib/filter')(ctx, cache));
  }

  injector.loadStylusPlugin = () => require('./lib/stylus')(ctx, injector);

  // Compatible with NexT Plugin
  injector.loadNexTPlugin = () => {
    cache.apply('loadNexTPlugin', () => {
      require('./lib/next')(ctx, injector);
      return true;
    });
  };
  // Compatible with NexT theme or previous Cake theme
  filter.register('after_init', () => {
    if (cache.has('loadNexTPlugin')) return;
    require('./lib/next-compatible')(ctx, injector);
  });

  return injector;
};

module.exports = initInjector;
