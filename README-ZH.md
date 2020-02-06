# hexo-extend-injector2

为插件提供扩展，能将代码注入到指定位置（如果主题提供相应的注入点）

## how to use

在需要使用的插件中安装

```bash
yarn add hexo-extend-injector2
```

通过`require()`引入injector使用

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.register('body-end', 'maybe a js script.');
```

## API

```js
const injector = require('hexo-extend-injector2')(hexo);

// injector 有两种写法
injector.register(entry, value, predicate, priority, isRun);
injector.register(entry, {
  value: value,
  predicate: predicate,
  priority: priority,
  isRun: true/false
});

// entry 代表注入位置，它忽略大小写以及` ` `-` `_`
entry = 'bodybegin' = 'bodyBegin' = 'body-begin' = 'body_begin'

// value 是注入的内容
value = 'String' 
// 也可以传入函数，会将注入点位置的上下文对象传入（可能为空）
value = ctx => `${ctx.page.path}`

// predicate 表示在情况下生效，默认 `() => true`
predicate = 'home' 或者 'post' 或者 'page' 或者 'archive' 或者 'category' 或者 'tag'
// 可以通过injector内置的is方法，在多个情况下
predicate = injector.is('home', 'category', ...)
// 同样也可以传入函数作为判断条件
predicate = ctx => ctx.is_post()

// priority 是优先级，默认10
priority = 10

// isRun 是特别定义的参数，hexo部分内容在文件更改之后重新加载，重新加载时会清空isRun为true的内容，避免重复加载，默认 false
isRun = false/true
```

### example

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.register('body-Begin', '------------');
injector.register('bodyBegin', 'AAAA', 'home', 11);
injector.register('bodyBegin', 'BBBB', injector.is('home', 'category'));
injector.register('bodyBegin', 'CCCC', ctx => ctx.is_post());
injector.register('bodyBegin', {
  value    : 'DDDD',
  predicate: ctx => ctx.is_post(),
  priority : 1
});
// if use it in `before_generate` filter, set `isRun` to true
hexo.extend.filter.register('before_generate', () => {
  injector.register('bodyBegin', {
    value    : 'isRun',
    predicate: ctx => ctx.is_post(),
    isRun: true
  });
});
```

## theme developer

> 你需要告知用户安装这个插件，或者将插件代码拷贝至你的主题

默认情况下，只提供四个注入点 `head-begin` `head-end` `body-begin` `body-end`，你可以设置`disable_injector2_default_point`为true禁用

其他的注入点需要主题的开发者提供，这个插件提供了写工具，以方便添加注入点

### helper

在主题的布局文件中可以使用helper指定注入点，例如

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

- injector(entry).list(): 获取该注入点的所有注入对象   
- injector(entry).rendered(): 获取并渲染该注入点的所有注入对象（如果value是函数，将执行转化为String）  
- injector(entry).text(): 将该注入点的所有注入内容渲染拼接后返回   

### stylus injector

如果你的主题使用了hexo-renderer-stylus，可以通过以下方式在stylus中使用injector

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

> 未来，NexT 可能调整注入方式

NexT主题已经尝试插件化，如果你希望在你的主题中使用它的插件，按下面进行配置

```js
const injector = require('hexo-extend-injector2')(hexo);
injector.loadNexTPlugin();
```

需要提供与[NexT类似的注入点](lib/next-point.js)
