'use strict';

const terser = require('terser');
const bundle = require('./bundle-utils');

module.exports = (ctx, injector) => {

  const config = injector.config.js;

  if (!config.enable) return;

  const source = bundle(ctx, injector, 'js', ['.js']);

  if (source.length === 0) return;

  const result = terser.minify(source, config.options);
  if (result.error) throw result.error;
  if (config.hash) {
    const hash = require('crypto').createHash(config.hash);
    const val = hash.update(result.code).digest('hex');
    config.path = config.path.replace('.js', `.${val}.js`);
  }

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  ctx.extend.generator.register('js-bundler', () => {
    return {
      path: config.path,
      data: result.code
    };
  });

};
