---
title: 从执行上下文理解作用域链
date: 2020-11-03
tags:
  - JS
---# 从执行上下文理解作用域链

参考自[ECMA-262-3 in detail. Chapter 4. Scope chain.](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/#:~:text=Scope%20chain%20is%20related%20with%20an%20execution%20context,the%20internal%20%5B%20%5BScope%5D%5D%20property%20of%20this%20function.)

## 定义

如果要简要地描述并展示要点，则作用域链主要与内部函数有关。

我们知道，ECMAScript 允许创建内部函数，我们甚至可以在父函数中返回这些函数。

```js
var x = 10;

function foo() {
  var y = 20;

  function bar() {
    alert(x + y);
  }

  return bar;
}

foo()(); // 30
```

因此，已知每个上下文都有自己的变量对象（variables object，VO）：对于全局上下文，它就是全局对象本身，对于函数，它就是活动对象（activation object，AO）

**作用域链就是内部上下文中所有（父级）变量对象的列表**。作用域链用于变量的查找。例如，在上述例子中，bar 函数的上下文的作用域链包括 AO（bar），AO（foo）和 VO（global）。

但是，让我们详细研究一下。

让我们从定义开始，然后会举例深入讨论。

> 作用域链与执行上下文有关，变量对象链用于标识符解析时的变量查找。

函数上下文的作用域链在函数调用时创建，其包含活动对象和内部`[[Scope]]`属性。之后我们会详细探讨函数的`[[Scope]]`属性。

上下文包含：

```js
activeExecutionContext = {
    VO: {...}, // or AO
    this: thisValue,
    Scope: [ // Scope chain
      // list of all variable objects
      // for identifiers lookup
    ]
};
```

其中 Scope 按定义是：

```js
Scope = AO + [[Scope]];
```

在例子中我们可以将 Scope 和`[[Scope]]`表示为简单数组。

```js
var Scope = [VO1, VO2, ..., VOn]; // scope chain
```

这种结构视图可以表示为分层对象链，并且在每个链接上引用父级的作用域（父级变量对象）

```js
var VO1 = {__parent__: null, ... other data}; -->
var VO2 = {__parent__: VO1, ... other data}; -->
// etc.
```

但是使用数组表示作用域链更为方便，因此我们将使用这种方法

我们将在下面讨论的 `AO + [[Scope]]`组合以及标识符解析过程与函数的生命周期有关

## 函数生命周期

函数生命周期分为创建阶段和激活（调用）阶段。让我们详细考虑一下。

### 函数创建阶段

我们知道，当进入上下文阶段，函数声明会被放入变量对象或者活动对象。让我们看到例子中全局执行上下文中一个变量声明和一个函数声明（我们知道在全局执行上下文中变量对象就是全局对象本身）。

```js
var x = 10;

function foo() {
  var y = 20;
  alert(x + y);
}

foo(); // 30
```

当函数执行时，我们看到正确的结果-30。然而又一个非常重要的特点。

在此之前我们一直讨论在当前执行上下文中的变量对象。这里我们看到 y 变量在函数 foo 中定义（也就是在函数 foo 执行上下文的 AO 中），但是变量 x 不是在函数 foo 执行上下文，所以没有添加到 foo 函数的 AO 中。乍一看，函数“ foo”根本不存在“ x”变量；但正如我们将在下面看到的那样-只是“乍看之下”。我们看到“ foo”上下文的激活对象仅包含一个属性-属性“ y”

```js
fooContext.AO = {
  y: undefined // undefined – on entering the context, 20 – at activation
};
```

但函数 foo 是怎么访问到 x 变量的呢？逻辑上推测函数可以访问更高上下文的变量对象。实际上正是如此，并且是通过函数内部的`[[Scope]]`属性实现的。

> `[[Scope]]`是所有父级变量对象的层次结构链，这些父变量对象位于当前函数上下文之上；链在创建时被保存到函数中。

注意要点-`[[Scope]]`在函数创建时保存-永久不变-直到函数销毁。即使永远不能调用函数，但是`[[Scope]]`属性已经编写并存储在函数对象中。

与作用域相反，`[[Scope]]`是函数的属性而不是上下文的属性。考虑以上示例，“ foo”函数的`[[Scope]]`为：

```js
foo[[Scope]] = [
  globalContext.VO // === Global
];
```

而且，通过函数调用，进入了一个函数上下文，在该上下文中创建了活动对象（AO），并确定了该值和作用域（作用域链）。

### 函数调用阶段

正如定义中所说的那样，在进入上下文并创建 AO / VO 之后，上下文的 Scope 属性（它是变量查找的作用域链）的定义如下：

```
Scope = AO | VO + [[Scope]];
```

这里的重点是**活动对象是 Scope 数组的第一个元素，即添加到作用域链的前面**：

```js
Scope = [AO].concat([[Scope]]);
```

这对于标识符的解析过程非常重要。

> 标识符解析是确定变量（或函数声明）属于作用域链中哪个变量对象的过程。

标识符解析的过程包括查找与变量名称相对应的属性，即从最深的上下文开始直到作用域链的顶部，对作用域链中的变量对象进行连续检查。

因此，查找时子上下文的局部变量比父上下文的变量具有更高的优先级，并且在两个具有相同名称但来自不同上下文的变量的情况下，第一个被发现是较深上下文的变量。

举个例子：

```js
var x = 10;

function foo() {
  var y = 20;

  function bar() {
    var z = 30;
    alert(x + y + z);
  }

  bar();
}

foo(); // 60
```

我们来分析这段代码中的变量对象，活动对象以及作用域链和函数的`[[Scope]]`属性：

首先是全局上下文，其变量对象是：

```js
globalContext.VO===global={
	x:10,
	foo:<reference to function>
}
```

然后在创建函数 foo 时，其`[[Scope]]`属性也创建了，是：

```js
foo[[Scope]] = [globalContext.VO];
```

当函数 foo 执行时，foo 上下文的活动对象是：

```js
fooContext.AO={
	y:20,
	bar:<reference to function>
}
```

所以 foo 函数上下文的作用域链是：

```js
fooContext.scope = fooContext.AO + foo[[Scope]];
fooContext.scope = [fooContext.AO, globalContext.VO];
```

然后当 bar 函数创建时，其`[[Scope]]`属性也创建，是：

```js
bar[[Scope]] = [fooContext.AO, globalContext.VO];
```

当 bar 函数调用时，bar 上下文的活动对象创建：

```js
barContext.AO = {
  z: 30
};
```

bar 函数上下文的作用域链是：

```js
barContext.scope = barContext.AO + bar[[Scope]];
barContext.scope = [barContext.AO, fooContext.AO, globalContext.VO];
```

标识符解析的过程是这样的：

```
x:
barContext.AO----没找到
fooContext.AO----没找到
globalContext.VO----找到了，是10

y:
barContext.AO----没找到
fooContext.AO----找到了，是20

z：
barContext.AO----找到了，是30
```

### 闭包

我们先来看一段代码：

```js
function foo(a) {
  var b = a;
  function bar(c) {
    console.log(a, b, c);
  }
  bar(2);
}
foo(3);
```

基于作用域链的理解，我们知道这段代码可以正常运行，输出 3,3,2。

如果稍作改动：

```js
function foo(a) {
  var b = a;
  function bar(c) {
    console.log(a, b, c);
  }
  return bar;
}
const fn = foo(3);
fn(2);
```

我们将 bar 函数作为 foo 函数的返回值，按照函数执行完，内部局部变量就会释放的原则上看，a 和 b 应该不能找到，但事实不是这样的，这段代码依旧可以正常执行，输出 3，3，2。原因就在于闭包。

关于闭包，我也看过很多文章，以 MDN 和阮一峰博客为例。

- [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures) 上的定义：闭包是由函数以及声明该函数的词法环境组合而成的，该词法环境包含这个闭包创建时作用域内的所有局部变量。

- 阮一峰大神在[学习 Javascript 闭包（Closure）](https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)中的解释：闭包就是能够读取其他函数内部变量的函数。

在例子中，fn 函数是执行 foo 函数执行时创建的对 bar 函数的引用，因此也维持了 bar 函数词法环境的引用（a，b 在其中），也就是局部变量并不会被销毁，当 fn 函数执行时，就能正常访问。

## 习题

- 习题一

```js
let x = 5;
function fn(x) {
  return function(y) {
    console.log(y + ++x);
  };
}
let f = fn(6);
f(7);
console.log(x);
```

答：14，5

- 习题二

现在要求实现点击第几个 button 就输出几

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
    </div>
  </body>
  <script></script>
</html>
```

1. let 块作用域

```js
const btns = document.querySelectorAll('button');
for (let index = 0; index < btns.length; index++) {
  const element = btns[index];
  element.addEventListener('click', function() {
    console.log(index + 1);
  });
}
```

2. 闭包

```js
const btns = document.querySelectorAll('button');
for (var index = 0; index < btns.length; index++) {
  (function(i) {
    const element = btns[i];
    element.addEventListener('click', function() {
      console.log(i + 1);
    });
  })(index);
}
```

- 习题三

```js
function fun(n, o) {
  console.log(o);
  return {
    fun: function(m) {
      return fun(m, n);
    }
  };
}

var a = fun(0); // ? undefined
a.fun(1); // ? 0
a.fun(2); // ? 0
a.fun(3); // ? 0
var b = fun(0)
  .fun(1)
  .fun(2)
  .fun(3); // ? undefined 0 0 0
var c = fun(0).fun(1); // ? undefined 0
c.fun(2); // ? 1
c.fun(3); // ? 1
```
