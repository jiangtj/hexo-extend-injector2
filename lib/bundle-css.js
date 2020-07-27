'use strict';

const CleanCSS = require('clean-css');
const fs = require('fs');
const {resolve} = require('path');

module.exports = (ctx, injector) => {

  const config = injector.config.css;

  if (!config.enable) return;

  const source = injector.get('css').rendered()
    .map(item => item.value)
    .map(item => {
      if (item.endsWith('.css')) {
        return fs.readFileSync(resolve(ctx.base_dir, item), 'utf8');
      }
      return item;
    })
    .join('\n');

  if (source.length === 0) return;

  const output = new CleanCSS(config.options).minify(source);
  if (output.error) throw output.error;

  if (config.hash) {
    const hash = require('crypto').createHash(config.hash);
    const val = hash.update(output.styles).digest('hex');
    config.path = config.path.replace('.css', `.${val}.css`);
  }

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('head-end', `<link rel="stylesheet" type="text/css" href="${url_for(config.path)}" />`);

  const { generator } = ctx.extend;
  generator.register('css-bundler', () => {
    return {
      path: config.path,
      data: output.styles
    };
  });
};
