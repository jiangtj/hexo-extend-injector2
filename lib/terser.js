'use strict';

const terser = require('terser');
const fs = require('fs');
const {resolve} = require('path');

module.exports = (ctx, injector) => {

  const config = injector.config().deeplyApply('terser', {
    enable: true,
    path: 'js/injector.js',
    hash: false,
    options: {}
  });

  if (!config.enable) return;

  const files = injector.get('js').rendered().map(item => item.value);
  if (files.length === 0) return;

  const code = {};
  files.forEach((item, index) => {
    let temp = item;
    if (item.endsWith('.js')) {
      temp = fs.readFileSync(resolve(ctx.base_dir, item), 'utf8');
    }
    code[`${index}.js`] = temp;
  });

  const result = terser.minify(code, config.options);
  if (result.error) throw result.error;
  if (config.hash) {
    const hash = require('crypto').createHash(config.hash);
    const val = hash.update(result.code).digest('hex');
    config.path = config.path.replace('.js', `.${val}.js`);
  }

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('bodyEnd', `<script src="${url_for(config.path)}"></script>`);

  ctx.extend.generator.register('injector-js', () => {
    return {
      path: config.path,
      data: result.code
    };
  });

};
