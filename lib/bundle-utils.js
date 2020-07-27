'use strict';

const {resolve} = require('path');

module.exports = (ctx, injector, point, suffixes) => {
  return injector.get(point).rendered()
    .map(item => {
      if (item.value) {
        for (const suffix of suffixes) {
          if (item.value.endsWith(suffix)) {
            item.path = item.value;
            return item;
          }
        }
        item.text = item.value;
      }
      return item;
    })
    .map(item => {
      if (item.path) {
        item.text = ctx.render.renderSync({path: resolve(ctx.base_dir, item.path)});
      }
      return item;
    })
    .map(item => item.text)
    .join('\n');
};
