'use strict';

const terser = require('terser');
const fs = require('fs');
const {resolve} = require('path');

module.exports = (ctx, injector) => {

  const config = injector.config().deeplyApply('terser', {
    enable: true,
    path: 'js/injector.js',
    options: {}
  });

  if (!config.enable) return;

  const files = injector.get('js').rendered().map(item => item.value);
  if (files.length === 0) return;

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  const code = {};
  files.forEach((item, index) => {
    let temp = item;
    if (item.endsWith('.js')) {
      temp = fs.readFileSync(resolve(ctx.base_dir, item), 'utf8');
    }
    code[`${index}.js`] = temp;
  });

  ctx.extend.generator.register('injector-js', () => {
    const result = terser.minify(code, config.options);
    if (result.error) throw result.error;
    return {
      path: config.path,
      data: result.code
    };
  });

};
