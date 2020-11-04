# 作用域，变量提升，闭包练习题

- 习题一

```js
let x = 5;
function fn(x) {
  return function (y) {
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
  element.addEventListener('click', function () {
    console.log(index + 1);
  });
}
```

2. 闭包

```js
const btns = document.querySelectorAll('button');
for (var index = 0; index < btns.length; index++) {
  (function (i) {
    const element = btns[i];
    element.addEventListener('click', function () {
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
    fun: function (m) {
      return fun(m, n);
    }
  };
}

var a = fun(0); // ? undefined
a.fun(1); // ? 0
a.fun(2); // ? 0
a.fun(3); // ? 0
var b = fun(0).fun(1).fun(2).fun(3); // ? undefined 0 0 0
var c = fun(0).fun(1); // ?
c.fun(2); // ?
c.fun(3); // ?
```
