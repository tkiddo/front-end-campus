# 闭包

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

基于上一节关于作用域链的讲解，我们知道这段代码可以正常运行，输出 3,3,2。

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
