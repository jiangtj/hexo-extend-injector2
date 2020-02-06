# hexo-extend-injector2

Provide extensions for plugins to inject code to specified locations (if the theme provides corresponding injection points)

[中文文档](README-ZH.md)

## how to use

Install this plugin
```bash
yarn add hexo-extend-injector2
```

Get injector by `require()`

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.register('body-end', 'maybe a js script.');
```

## API

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

## theme developer

> You need to tell users to install this plugin or copy the plugin code into your theme

By default, only four injection points are provided `head-begin` `head-end` `body-begin` `body-end`, you can set `disable_injector2_default_point` to true to disable

Other injection points need to be provided by the theme developer. This plugin provides some utils to add the addition of injection points.

### helper

Helper can be used to specify the injection point in the theme's layout file, for example

```ejs
<! DOCTYPE html>
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

injector(entry).list(): Get all injection objects of this injection point  
injector(entry).rendered(): get and render all injection objects of this injection point (if value is a function, it will be converted to String)  
injector(entry).text(): render and merge all the injected content of this injection point  

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

> In the future, NexT may adjust the injection method

The NexT theme has been tried for plugins. If you want to use its plugin in your theme, configure it as follows

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.loadNexTPlugin();
```

Need to provide [NexT-like injection point](lib/next-point.js)
