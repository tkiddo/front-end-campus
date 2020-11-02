# 作用域链

翻译自[ECMA-262-3 in detail. Chapter 4. Scope chain.](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/#:~:text=Scope%20chain%20is%20related%20with%20an%20execution%20context,the%20internal%20%5B%20%5BScope%5D%5D%20property%20of%20this%20function.)

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
