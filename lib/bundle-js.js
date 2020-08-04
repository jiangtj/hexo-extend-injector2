'use strict';

const { minify } = require('terser');
const bundle = require('./bundle-utils');

module.exports = (ctx, injector) => {

  const config = injector.config.js;

  if (!config.enable) return;

  const check = injector.get('js').list();
  if (check.length === 0) return;

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  ctx.extend.generator.register('js-bundler', () => {
    return {
      path: config.path,
      data: () => bundle(ctx, injector, 'js', ['.js'])
        .then(source => minify(source, config.options))
        .then(result => result.code)
    };
  });

};
