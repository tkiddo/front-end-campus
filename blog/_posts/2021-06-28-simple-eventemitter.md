---
title: 实现 EventEmitter
date: 2021-06-28
tags:
  - JS
  - Node
---

对于事件，我们并不陌生。比如，在浏览器中，监听按钮点击事件，以便在用户点击时触发处理函数。

```js
const button = document.querySelector('#button');
button.addEventListener('click', function() {
  console.log('clicked');
});
```

而在 node 环境中，很多 API 也是基于事件驱动模型创建的。事件驱动模型，即某个特殊的对象（这里称为'发送者'）通过发送指定事件而执行对应的函数（这里称为'监听者'）。比如，`fs.ReadStream`在打开文件时发送一个事件。

任何可以发送事件的对象都是`EventEmitter`类的实例。

```js
const EventEmitter = require('events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

在以上代码中，首先创建`EventEmitter`实例，然后通过`on()`方法注册事件及回调函数，该函数在`myEmitter.emit('event');`时执行。

## EventEmitter API

- `instance.on(type,listener)`

注册事件，`type`为事件名，`listener`为回调函数

- `instance.emit(type,arg1,arg2,...)`

发送事件，并给回调函数传参

- `instance.once(type,listener)`

和`on`方法一样是注册事件，但不同的是回调函数只执行一次，可以理解为`on`和`removeListener`的结合

- `instance.removeListener(type,listener)`

移除指定事件监听器

## 实现简易版的 EventEmitter

实现逻辑比较简单，在`on`方法中将监听函数保存起来，在`emit`方法中去执行。保存的方式可以是普通对象或者 `Map` 的键值对形式。本文以`Map`为例。

```js
function EventEmitter() {
  EventEmitter.prototype.init.call(this);
}

EventEmitter.prototype.init = function() {
  this._eventsMap = new Map();
};
```

创建一个 Map 对象用于保存事件监听器。

1. `on()`

```js
EventEmitter.prototype.on = function(type, listener) {
  const existing = this._eventsMap.get(type);
  const eventsMap = this._eventsMap;
  if (!existing) {
    // 如果map中不存在该事件，则为map对象新加一个键，并赋值为监听函数
    eventsMap.set(type, listener);
  } else {
    if (typeof existing === 'function') {
      // 如果map中已存在该事件，则将事件值改为数组，并加入新的监听函数，这种情况发生在第二次监听同一事件
      eventsMap.set(type, [existing, listener]);
    } else {
      // 监听同一事件两次之后再监听，则直接在回调函数数组尾部添加即可
      eventsMap.get(type).push(listener);
    }
  }
};
```

> 源码中实现`on`方法时还有一个优先级参数，可以配置回调函数的执行顺序

2. `emit()`

```js
function apply(target, type, listener, args) {
  listener.apply(target, args);
}

EventEmitter.prototype.emit = function(type) {
  // 获取指定事件的回调函数
  const handler = this._eventsMap.get(type);
  // 获取回调函数参数
  const args = [];
  for (let i = 1; i < arguments.length; i++) args.push(arguments[i]);

  // 如果事件对应的回调函数不存在，则返回
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    // 如果是函数类型，则执行该函数
    apply(this, type, handler, args);
  } else {
    // 如果是数组，则执行数组中的每一个函数
    handler.forEach((item) => {
      apply(this, type, item, args);
    });
  }
};
```

3. `once()`

`once()`和`on()`的区别仅仅在于执行一次后移除。

```js
EventEmitter.prototype.once = function(type, listener) {
  // 因为函数也是对象，可以给函数添加一个属性标记为一次性的函数
  listener.isOnce = true;
  this.on(type, listener);
};
```

然后在`apply`函数中加上判断，如果是一次性的函数，则执行过后就移除

```js
function apply(target, type, listener, args) {
  listener.apply(target, args);
  if (listener.isOnce) {
    target.removeListener(type, listener);
  }
}
```

> 这里比较取巧，源码有更高级的实现，可以查看[github](https://github.com/browserify/events)

4. `removeListener()`

```js
EventEmitter.prototype.removeListener = function(type, listener) {
  const existing = this._eventsMap.get(type);
  const eventsMap = this._eventsMap;
  if (typeof existing === 'function') {
    // 如果仅仅是一个函数，则移除map中的键
    eventsMap.delete(type);
  } else if (Array.isArray(existing)) {
    // 如果对应的回调是数组，则需要找到对应的回调函数，并删除
    const idx = existing.findIndex((i) => i === listener);
    if (idx >= 0) {
      existing.splice(idx, 1);
    }
  }
};
```

## 小结

`EventEmitter`对于理解 nodejs 的事件驱动模型非常重要
