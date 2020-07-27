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
        console.log(resolve(ctx.base_dir, item.path));
        console.log(ctx.render.isRenderable(resolve(ctx.base_dir, item.path)));
        item.text = ctx.render.renderSync({path: resolve(ctx.base_dir, item.path)});
      }
      if (point === 'css') {
        console.log(item);
      }
      return item;
    })
    .map(item => item.text)
    .join('\n');
};
