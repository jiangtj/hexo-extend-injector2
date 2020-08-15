'use strict';

const {resolve} = require('path');

module.exports = (ctx, injector, point, suffixes = []) => {
  const data = injector.get(point).list()
    .map(item => {
      if (item.value) {
        for (const suffix of suffixes) {
          if (typeof item.value === 'string' && item.value.endsWith(suffix)) {
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
        return ctx.render.render({path: resolve(ctx.base_dir, item.path)});
      }
      if (typeof item.text === 'function') {
        return Promise.resolve(ctx).then(item.text);
      }
      return Promise.resolve(item.text);
    });
  return Promise.all(data).then(values => values.join('\n'));
};
