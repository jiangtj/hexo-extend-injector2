'use strict';

const CleanCSS = require('clean-css');
const bundle = require('./bundle-utils');


const generateCss = (ctx, injector, options, file) => {

  if (injector.getSize('css') === 0) return;

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('head-end', `<link rel="stylesheet" type="text/css" href="${url_for(file.path)}" />`);

  const { generator } = ctx.extend;
  generator.register('css-bundler', () => {
    return {
      path: file.path,
      data: () => bundle(ctx, injector, 'css', ['.css', '.sass', '.styl']).then(source => {
        const output = new CleanCSS(options).minify(source);
        if (output.error) throw output.error;
        return output.styles;
      })
    };
  });

};

module.exports = (ctx, injector) => {

  const config = injector.config.css;

  if (!config.enable) return;

  const { REGISTER_VARIABLE, REGISTER_STYLE } = injector.order;

  // Get value from variable and style
  const variables = injector.get('variable').list();
  variables.forEach(element => {
    element.priority = REGISTER_VARIABLE;
    injector.register('css', element);
  });
  const styles = injector.get('style').rendered();
  styles.forEach(element => {
    element.priority = REGISTER_STYLE;
    injector.register('css', element);
  });

  if (typeof config.path === 'string') {
    const { path } = config;
    config.path = [{ env: 'default', path }];
  }

  config.path.forEach(item => generateCss(ctx, injector, config.options, item));

};
