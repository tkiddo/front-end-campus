---
title: javascript 中的数据类型有哪些？
date: 2020-10-28
tags:
  - JS
author: tkiddo
---

# javascript 中的数据类型有哪些？

在 ES5 以及更早的版本中，JS 数据类型包括 6 种：Number，String，Boolean，Null，Undefined，Object。

在 ES6 中加入了 Symbol 类型

在 chrome 67 版后又支持了 BigInt 类型。

所以至今，JS 中公有 8 种数据类型。

# 基本数据类型和引用数据类型的区别

基本数据类型包括：除了 Object 外的 7 种

引用数据类型包括：Object

### 区别

存储方式不同，基本类型的数据存储在栈中，访问变量即是访问数据；引用类型的数据存储在堆中，变量中存的是数据在堆中的地址，通过地址访问。

# 习题

1.

```js
let a = {},
  b = '0',
  c = 0;
a[b] = 'hello';
a[c] = 'world';
console.log(a[b]); //world
```

因为 a 是引用类型，对象中不能存在相同的键，数字 0 和字符 0 相同，所以值被重写了。

2.

```js
let a = {},
  b = Symbol(0),
  c = Symbol(0);
a[b] = 'hello';
a[c] = 'world';
console.log(a[b]); //hello
```

Symbol 是唯一值，不相等。

3.

```js
let a = {},
  b = {},
  c = {};
a[b] = 'hello';
a[c] = 'world';
console.log(a[b]); //world
```

对象作为键时，都会转化成字符串'[object Object]'

4.

```js
let a = { m: 1 },
  b = a;
b.m = 2;
console.log(a.m); //2
```

对象是引用类型，a，b 中存储的都是同一个地址，改变的是同一个对象。

5.

```js
let a = { m: 1 };
function fn(obj) {
  let a = obj;
  a.m = 3;
}
fn(a);
console.log(a.m); //3
```

函数传参是值传递，即传递的是地址，根据地址改变对象的属性，改变的是同一个对象。

# 深浅拷贝

基于引用类型的特点，可以延伸出深浅拷贝。

### 浅拷贝

只是拷贝了对象的第一层，属性值若仍是引用类型，则只拷贝其地址，因而两个对象仍旧有联系。ES6 里的扩展运算符`...`就是浅拷贝

### 深拷贝

对于每一层都拷贝,一般可以用`JSON.parse(JSON.stringify(obj))`实现，但也有局限性，也可用递归实现，lodash 库中有深拷贝的实现方法
