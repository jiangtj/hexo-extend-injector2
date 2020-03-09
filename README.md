# hexo-extend-injector2

Provide extensions for plugins or themes to inject code to specified locations (if the theme provides corresponding injection points)

![npm](https://img.shields.io/npm/v/hexo-extend-injector2.svg)

[中文文档](README-ZH.md)

The function of this plugin refers to the design of the native injector, but because it cannot be compatible with the original next plugin scheme, it is redesigned to provide more extension capabilities. For details, see [this PR](https://github.com/jiangtj/hexo-theme-cake/pull/39)

## install

```bash
yarn add hexo-extend-injector2
```

Provides some additional configurations (built-in functions)

```yml
injector2:
  # Render stylus injection point content as a single CSS file, not enabled by default (docs see theme developer)
  stylus:
    enable: true
    path: css/injector.css
    points: ['variable', 'style']
  # terser compress js, and inject into bodyEnd, default enable
  terser:
    enable: true
    path: js/injector.js
    # options:
```

## plugin developer

```js
const injector = require ('hexo-extend-injector2')(hexo);

// There are two ways to write
injector.register(entry, value, predicate, priority, isRun);
injector.register(entry, {
  value: value,
  predicate: predicate,
  priority: priority,
  isRun: true / false
});

// entry is the injection position, it ignores case and ` ` `-` `_`
entry = 'bodybegin' = 'bodyBegin' = 'body-begin' = 'body_begin'

// value is the injected content
value = 'String'
// You can also provide a function, which will pass a context object at the injection point (may be empty)
value = ctx => `${ctx.page.path}`

// predicate means that it takes effect in the case, default `() => true`
predicate = 'home' or 'post' or 'page' or 'archive' or 'category' or 'tag'
// You can use the built-in is method of the injector, in multiple cases
predicate = injector.is('home', 'category', ...)
// You can also provide a function as condition
predicate = ctx => ctx.is_post()

// priority default is 10
priority = 10

// isRun is a specially defined parameter. Part of the hexo content is reloaded after the file is changed. When reloading, the content of isRun is true will clear to avoid repeated loading.
isRun = false / true
```

### example

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.register('body-Begin', '------------');
injector.register('bodyBegin', 'AAAA', 'home', 11);
injector.register('bodyBegin', 'BBBB', injector.is('home', 'category'));
injector.register('bodyBegin', 'CCCC', ctx => ctx.is_post());
injector.register('bodyBegin', {
  value: 'DDDD',
  predicate: ctx => ctx.is_post(),
  priority: 1
});
// if use it in `before_generate` filter, set` isRun` to true
hexo.extend.filter.register('before_generate', () => {
  injector.register('bodyBegin', {
    value: 'isRun',
    predicate: ctx => ctx.is_post(),
    isRun: true
  });
});
```

### case
- [hexo-cake-moon-menu](https://github.com/jiangtj-lab/hexo-cake-moon-menu)
- [hexo-cake-canvas-ribbon](https://github.com/jiangtj-lab/hexo-cake-canvas-ribbon)

## terser

When terser is enabled, the JS content or file injected into the `js` injection point will be compressed into a JS file and injected into the `bodyEnd`

```js
// you can add JS content directly
injector.register('js', 'function log1() {console.log("bar");}');
// if it ends with `.js`, it will be judged as a JS file
injector.register('js', 'apple.js');
```

## theme developer

> You need to tell users to install this plugin or copy the plugin code into your theme

By default, only four injection points are provided `head-begin` `head-end` `body-begin` `body-end`, you can set `disable_injector2_default_point` to true to disable

Other injection points need to be provided by the theme developer. This plugin provides some utils to add the addition of injection points.

### helper

Helper can be used to specify the injection point in the theme's layout file, for example

```ejs
<!DOCTYPE html>
<html>
<head>
  <%- injector('head-begin').text() -%>
  ...
  <%- injector('head-end').text() -%>
</head>
<body>
  <%- injector('body-begin').text() -%>
  ...
  <%- injector('body-end').text() -%>
</body>
</html>
```

- injector(entry).list(): Get all injection objects of this injection point  
- injector(entry).rendered(): get and render all injection objects of this injection point (if value is a function, it will be converted to String)  
- injector(entry).text(): render and merge all the injected content of this injection point  

### stylus injector

If your theme uses hexo-renderer-stylus, you can use injector in stylus in the following ways

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.loadStylusPlugin();
```

main.styl
```styl
@import "_variables/base";
injector('variable')
@import "_mixins/base";
injector('mixin')
@import "_common/base";
injector('style')
```

### NexT plugin

The NexT theme has been tried for plugins. If you want to use its plugin in your theme, configure it as follows

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.loadNexTPlugin();
```

Need to provide [NexT-like injection point](lib/next-point.js)

### case
- [hexo-theme-cake](https://github.com/jiangtj/hexo-theme-cake)
