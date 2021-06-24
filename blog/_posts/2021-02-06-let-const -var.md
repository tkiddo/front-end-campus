---
title: ES6:let const 和 var
date: 2021-02-06
tags:
  - JS
  - ES6
author: 唐凯强
---

# ES6: let const 和 var

在 ES6 之前，声明变量用的关键字只有`var`，ES6 新增加了`let`和`const`这两个关键字来声明变量。

那么，`let`和`const`的出现解决了什么问题呢？和`var`又有什么不同呢？

## 变量提升

这要从 JavaScript 的一个特性说起，那就是变量提升。

我们先通过代码来看一下什么是变量提升

```js
console.log(foo);

var foo = 'hello';
```

按照常规的逻辑，在变量 foo 声明之前访问它，应该会报错:`ReferenceError`，即引用错误，但事实却是不报错，并输出`undefined`。

这就是变量提升，所谓变量提升，就是 JavaScript 引擎会在代码执行之前搜索所有的变量声明，并将声明提升到当前作用域的顶端，且值为`undefined`。所以，以上代码可以这么理解：

```js
var foo;

console.log(foo);

foo = 'hello';
```

由于变量提升的存在，块级作用域很难实现。比如：

```js
function bar(flag) {
  if (flag) {
    var foo = 'hello';
    return foo;
  } else {
    return null;
  }
}
```

变量提升会把`foo`的声明提升到函数作用域的顶部，也就是

```js
function bar(flag) {
  var foo;

  if (flag) {
    foo = 'hello';
    return foo;
  } else {
    // 这里也可以访问到foo变量
    return null;
  }

  // 这里也可以访问到foo变量
}
```

这也就造成了无论在条件语句的哪个块中都能访问到 `foo` 变量。

为此，ES6 引入了`let`和`const`来加强对变量生命周期的控制。

## 块级声明

块级声明用于声明在指定块的作用域外无法访问的变量。块作用域存在于：

- 函数中

- 块中（就是`{}`之间的区域）

`let`声明会把变量的作用域限制在当前的代码块中。

```js
function bar(flag) {
  if (flag) {
    let foo = 'hello';
    return foo;
  } else {
    // 这里是不能访问到foo变量的
    return null;
  }

  // 这里也不能访问到foo变量
}
```

当我们在`let`声明之前访问变量时，就会报`ReferenceError`。**因为 JavaScript 引擎在扫描变量声明时，会把`let`声明的变量放在‘暂时性死区’中，只有在执行过变量声明语句后，才会把变量从‘暂时性死区’中取出来，才能正常访问。**

## const

`const`声明和`let`声明类似，只是`const`声明的是常量，不允许更改。当我们试图给`const`声明的变量重新赋值时，就会报`TypeError`错,提示我们不能给常量重新赋值。但如果`const`声明的是一个对象，则可以更改其属性。

```js
const obj = { name: 'hello' };

// 可以
obj.age = 11;

//不可以
obj = { name: 'hello', age: 11 };
```

## let,const 和 var 的区别

`let`,`const`和`var`的区别主要有以下几个方面：

1. `var`存在变量提升，而`let`,`const`不存在提升，会将变量声明存放在‘暂时性死区’中。（上文已经讲过）

2. `var`声明没有块级作用域，`let`和`const`声明会将变量限制在指定的块中。

3. `var`可以重复声明，`let`和`const`不允许

```js
var temp = 1;
// 可以
var temp = 2;
// 不可以
let temp = 3;
```

4. `var`声明在全局作用域的变量，会作为全局对象（浏览器中是 window）的属性，`let`和`const`不会

```js
var foo = 1;

console.log(window.foo); //1

let bar = 2;

console.log(window.bar); //undefined
```

## 循环中的作用域绑定

先看一道经典的面试题：

```js
var list = [];
for (var i = 0; i < 3; i++) {
  list.push(() => {
    console.log(i);
  });
}
list.forEach((fn) => {
  fn();
});
```

我们预想的是输出`0，1，2`，但实际是输出`3，3，3`。这是为什么呢？

因为循环中的每个函数都共享了同一个 i 变量，导致函数执行时，输出的是同一个 i，所以是一样的值。

解决这个问题，可以通过 IIFE：

```js
var list = [];
for (var i = 0; i < 3; i++) {
  list.push(
    ((i) => {
      return () => {
        console.log(i);
      };
    })(i)
  );
}
list.forEach((fn) => {
  fn();
});
```

这里利用了闭包的原理，简单地说，就是利用 IIFE 拷贝了每一次循环中的 i 变量。

使用`let`声明则更为简洁。

```js
var list = [];
for (let i = 0; i < 3; i++) {
  list.push(() => {
    console.log(i);
  });
}
list.forEach((fn) => {
  fn();
});
```

因为每次循环的时候`let`声明都会创建一个新的变量 i，并将其初始化为当前的 i 值，所以每个函数都能得到自己的 i 值。

## 小结

ES6 新增了`let`和`const`声明，引入了块级作用域来更好地控制变量的生命周期。`let`和`const`声明的变量不会提升到当前作用域顶部，但存在'暂时性死区'，在声明语句执行之前不能访问。`const`声明常量，不能更改，如果是对象，可以更改属性，但不能重新赋值。

最佳实践：默认使用`const`,只有在确实需要改变变量的值时用`let`


