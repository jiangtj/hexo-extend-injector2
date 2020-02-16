'use strict';

module.exports = (ctx, injector) => {

  const config = injector.config().deeplyApply('stylus', {
    enable: false,
    path: 'css/injector.css',
    points: ['variable', 'mixin', 'style']
  });

  if (!config.enable) return;

  injector.loadStylusPlugin(ctx);

  const url_for = require('hexo-util').url_for.bind(ctx);
  injector.register('head-end', `<link rel="stylesheet" type="text/css" href="${url_for(config.path)}" />`);

  const { generator } = ctx.extend;
  generator.register('injector-stylus', () => {
    return {
      path: config.path,
      data: () => {
        const text = config.points.map(item => `injector('${item}')`).join('\n');
        return ctx.render.render({text, engine: 'styl'});
      }
    };
  });
};
