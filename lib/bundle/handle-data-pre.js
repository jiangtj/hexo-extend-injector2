'use strict';

/**
 * 兼容以前的版本 v0.2
 * injector.register('css', {text: '.book{font-size:2rem}'});
 * injector.register('css', {path: 'xxxx.css'});
 */

const {resolve} = require('path');

module.exports = (ctx, data, suffixes = []) => {
  if (data.path) {
    data.value = () => ctx.render.renderSync({path: resolve(ctx.base_dir, data.path)});
    return;
  }
  if (data.text) {
    data.value = data.text;
    return;
  }
  if (typeof data.value === 'string') {
    for (const suffix of suffixes) {
      if (data.value.endsWith(suffix)) {
        data.value = () => ctx.render.renderSync({path: resolve(ctx.base_dir, data.path)});
        return;
      }
    }
  }
};
