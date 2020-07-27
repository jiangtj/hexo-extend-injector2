'use strict';

const Injector = require('./injector');
const order = require('./order');
const defaultConfig = require('./default-config');
const { mergeWith } = require('lodash');
const { join } = require('path');
const { readFileSync } = require('fs');

const loadInjector = ctx => {
  const { helper, filter } = ctx.extend;

  // Init injector
  const injector = new Injector();
  ctx.extend.injector2 = injector;
  ctx.on('generateBefore', () => {
    injector.clean();
  });
  injector.order = order;

  // Init config
  filter.register('after_init', () => {
    const themeD = JSON.parse(readFileSync(join(ctx.theme_dir, 'package.json'), 'utf-8'));
    if (themeD.name === 'hexo-theme-next') {
      defaultConfig.load_next_plugin = false;
    }
    injector.config = mergeWith(defaultConfig, ctx.config.injector, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }, order.INIT_CONFIG);

  // Set injector helper
  filter.register('after_init', () => {
    helper.register('injector', function(point) {
      injector.config[`injector_point_${injector.formatKey(point)}`] = true;
      return injector.get(point, { context: this });
    });
  }, order.REGISTER_HELPER);

  // Set default injection point
  filter.register('after_init', () => {
    if (!injector.config.disable_default_point) {
      filter.register('_after_html_render', require('./filter')(injector));
    }
  }, order.REGISTER_DEFAULT_POINT);

  // Load next plugin
  filter.register('after_init', () => {
    if (injector.config.load_next_plugin) {
      require('./next')(ctx, injector);
    } else {
      require('./next-compatible')(ctx, injector);
    }
  }, order.LOAD_NEXT_PLUGIN);

  // Build js bundler
  filter.register('after_init', () => {
    require('./terser')(ctx, injector);
  }, order.BUILD_JS_BUNDLER);

  return injector;
};

module.exports = loadInjector;
