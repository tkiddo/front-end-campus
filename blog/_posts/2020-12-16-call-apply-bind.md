---
title: 手写 JS 系列：call，apply，bind
date: 2020-12-16
tags:
  - JS
author: tkiddo
---

# 手写 JS 系列：call，apply，bind

我们知道，this 指向函数的直接调用者或者使用 new 操作符创建的对象，那么，call，apply，bind 解决了什么问题呢？

考虑这么一种场景：

```js
function hi(msg) {
  console.log(`${msg},${this.name}`);
}
const a = { name: 'a' };
const b = { name: 'b' };
const c = { name: 'c' };
```

现在有三个对象 a，b，c，都想调用 hi 函数，并希望得到正确地结果。

我们知道函数中的 this 指向函数的直接调用者，即我们必须以`a.hi('hello')`的方式才能保证 hi 函数中的 this 指向 a，然而 a 对象上并没有 hi 方法，所以：

```js
const a = { name: 'a', hi };
const b = { name: 'b', hi };
const c = { name: 'c', hi };

a.hi('hello');
b.hi('hello');
c.hi('hi');
```

这样，就能使每个对象都能调用 hi 方法，并且使其中的 this 指向对象自己。但是，我们发现，这个方法也许并不是我们所需要的，我们只是临时用一下，就要为每个对象都添加这么一个方法，就太过于麻烦了。

这时候，call，apply，bind 的作用就来了：

`fn.call(target, arg1, arg2, ...)`

`fn.apply(target, [arg1, arg2, ...])`

`fn.bind(target)`

其中 fn 指的是需要调用的函数，target 即函数中 this 需要指向的对象，剩余的是 fn 函数的参数。其中 call，apply 会立即执行 fn 函数，不同的是 apply 的第二个参数是数组；bind 会返回一个函数，而不是立即执行。

```js
function hi(msg) {
  console.log(`${msg},${this.name}`);
}
const a = { name: 'a' };
const b = { name: 'b' };
const c = { name: 'c' };

hi.call(a, 'hello');
hi.apply(b, ['hi']);
hi.bind(c)('yes');
```

这样依赖，就不必为每个对象都添加不必要的方法了。

知道了用法，我们就来手动实现一下 call，apply，bind。

其实很简单，把握一点，即 this 指向函数的直接调用者即可

call:

```js
Function.prototype.myCall = function() {
  // 判断this是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  let [context, ...args] = [...arguments];
  context = context ? context : window;
  // 将方法添加到对象中
  context.fn = this;
  const result = context.fn(...args);
  // 执行完后删除方法，保证对象不变
  delete context.fn;
  return result;
};
```

> 非严格模式中，传入 call 的第一个参数，如果传入的值为 null 或者 undefined 都会被全局对象代替，而其他的原始值则会被相应的包装对象（wrapper object）所替代

apply 类似：

```js
Function.prototype.myApply = function() {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  // 这里的args是数组
  let [context, args] = [...arguments];
  context = context ? context : window;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

bind:

```js
Function.prototype.myBind = function() {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  let [context, ...args] = [...arguments];
  context = context ? context : window;
  const fn = this;
  return function F() {
    //因为返回了一个函数，可以new F(),所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    // 因为返回的函数，调用时可以传参
    return fn.apply(context, [...args, ...arguments]);
  };
};
```

更多文章，参见 github:[tkiddo/front-end-interview](https://github.com/tkiddo/front-end-interview)
