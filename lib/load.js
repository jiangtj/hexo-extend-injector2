'use strict';

const Injector = require('./injector');

const loadInjector = ctx => {
  const { helper, filter } = ctx.extend;

  // Init injector
  const injector = new Injector();
  ctx.extend.injector2 = injector;
  ctx.on('generateBefore', () => {
    injector.clean();
  });

  // Init config
  if (ctx.config.injector2) {
    for (const [key, value] of Object.entries(ctx.config.injector2)) {
      injector.config().set(key, value);
    }
  }

  // Set injector helper
  helper.register('injector', function(point) {
    injector.config().set(`injector_point_${injector.formatKey(point)}`, true);
    return injector.get(point, { context: this });
  });

  // Set default injection point
  if (!injector.config().get('disable_default_point')) {
    filter.register('_after_html_render', require('./filter')(ctx, injector));
  }

  // injector extend
  // Load Stylus Plugin
  injector.loadStylusPlugin = () => {
    filter.register('stylus:renderer', require('./stylus-helper')(ctx.base_dir, injector));
  };
  // Compatible with NexT Plugin
  injector.loadNexTPlugin = () => {
    injector.config().apply('load_next_plugin', () => {
      require('./next')(ctx, injector);
      return true;
    });
  };

  // Load injector default operate
  filter.register('after_init', () => {
    // Render stylus, if use want.
    require('./stylus-renderer')(ctx, injector);
    // Compatible with NexT theme or previous Cake theme
    if (!injector.config().get('load_next_plugin')) {
      require('./next-compatible')(ctx, injector);
    }
    // Render js.
    require('./terser')(ctx, injector);
  }, 999);

  return injector;
};

module.exports = loadInjector;
