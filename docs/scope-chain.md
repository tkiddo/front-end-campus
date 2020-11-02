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

与作用域相反，`[[Scope]]`是函数的属性而不是上下文。考虑以上示例，“ foo”函数的`[[Scope]]`为：

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

这里的重点是活动对象是 Scope 数组的第一个元素，即添加到作用域链的前面
