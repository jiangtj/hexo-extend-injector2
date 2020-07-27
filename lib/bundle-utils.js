'use strict';

const {resolve} = require('path');

module.exports = (ctx, injector, point, suffixes) => {
  const data = injector.get(point).rendered()
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
        return ctx.render.render({path: resolve(ctx.base_dir, item.path)});
      }
      return Promise.resolve(item.text);
    });
  return Promise.all(data).then(values => values.join('\n'));
};
