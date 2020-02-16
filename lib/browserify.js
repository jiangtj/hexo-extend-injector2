'use strict';

const browserify = require('browserify');

module.exports = (ctx, injector) => {

  const config = injector.config().deeplyApply('browserify', {
    enable: true,
    path: 'js/injector.js',
    options: {
      basedir: ctx.base_dir
    }
  });

  if (!config.enable) return;

  const files = injector.get('js').rendered().map(item => item.value);
  if (files.length === 0) return;

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  browserify(files, config.options).bundle((_err, buf) => {
    ctx.extend.generator.register('injector-js', () => {
      return {
        path: config.path,
        data: buf.toString()
      };
    });
  });

};
