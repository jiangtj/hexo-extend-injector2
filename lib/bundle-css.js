'use strict';

const CleanCSS = require('clean-css');
const bundle = require('./bundle-utils');
const {resolve} = require('path');
const { REGISTER_VARIABLE, REGISTER_STYLE } = require('./order');
const { values } = require('lodash');

module.exports = (ctx, injector) => {

  const config = injector.config.css;

  if (!config.enable) return;

  // Get value from variable and style
  const variables = injector.get('variable').list();
  variables.forEach(element => {
    element.priority = -REGISTER_VARIABLE;
    injector.register('css', element);
  });
  const styles = injector.get('style').rendered();
  styles.forEach(element => {
    element.priority = REGISTER_STYLE;
    injector.register('css', element);
  });

  const suffixes = ['.css', '.sass', '.styl'];
  const data = injector.get('css').rendered()
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

  Promise.all(data)
    .then(values => values.join('\n'))
    .then(source => {
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
    });

};
