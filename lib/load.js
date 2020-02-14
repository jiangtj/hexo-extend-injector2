'use strict';

const Injector = require('./injector');
const { Cache } = require('hexo-util');
const cache = new Cache();

const loadInjector = ctx => {
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
    filter.register('after_route_render', require('./filter')(ctx, cache));
  }

  // Load Stylus Plugin
  injector.loadStylusPlugin = () => {
    filter.register('stylus:renderer', require('./stylus')(ctx.base_dir, injector));
  };

  // Compatible with NexT Plugin
  injector.loadNexTPlugin = () => {
    cache.apply('loadNexTPlugin', () => {
      require('./next')(ctx, injector);
      return true;
    });
  };
  // Compatible with NexT theme or previous Cake theme
  filter.register('after_init', () => {
    if (cache.has('loadNexTPlugin')) return;
    require('./next-compatible')(ctx, injector);
  });

  return injector;
};

module.exports = loadInjector;
