'use strict';

const { minify } = require('terser');
const handleDataPre = require('./handle-data-pre');

const loadJsScript = (ctx, injector, config) => {
  const { generator } = ctx.extend;

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  generator.register('js-bundler', () => {
    return {
      path: config.path,
      data: () => {
        const source = injector.get('js').text('\n');
        return minify(source, config.options)
          .then(result => result.code);
      }
    };
  });
};

module.exports = (ctx, injector) => {

  const config = injector.config.js;

  if (!config.enable) return;

  const { filter } = ctx.extend;

  let isLoadJsScript = false;

  filter.register('injector2:register-js', data => {
    if (!isLoadJsScript) {
      loadJsScript(ctx, injector, config);
      isLoadJsScript = true;
    }
    handleDataPre(data, ['.js']);
  });

};