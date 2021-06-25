---
title: Promise API
date: 2021-01-10
tags:
  - JS
  - Promise
---# Promise API

在之前的文章[手写系列：Promise 实现](https://github.com/唐凯强/front-end-interview/blob/main/docs/promise.md)中，我们了解了 Promise 是什么以及实现原理。

今天，我们来整理以下 Promise 的 API

## `Promise.all()`

在开发中，我们可能会遇到需要同时请求两个或更多的数据接口的场景。

`Promise.all()`接收一个 Promise 的 iterable 类型（可迭代类型，包括 Array，Map，Set），然后返回一个 Promise 实例，输入的所有 Promsie 的 resolve 回调的结果是一个数组。注意，**这个 Promise 实例的 resolve 回调是在所有输入的 Promise 的 resolve 回调之后执行，但是 reject 回调则是只要有一个输入的 Promise 的 reject 回调执行，它就会执行。**

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 0);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('B');
  }, 1000);
});

Promise.all([promiseA, promiseB]).then((res) => {
  // 所有输入promise的resolve回调的值保存在数组中
  const [a, b] = res;
  console.log(a, b); // A B
});
```

当有一个输入 promise reject 后，整体就进入 catch 回调，并不会进入 then 回调

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 0);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('B error');
  }, 1000);
});

Promise.all([promiseA, promiseB])
  //并不会进入then
  .then((res) => {
    const [a, b] = res;
    console.log(a, b);
  })
  //直接catch
  .catch((error) => {
    console.log(error); // B error
  });
```

如果希望`Promise.all()`返回的实例在其中一个输入 promise reject 的时候仍旧可以进入 then 回调，则需要为每一个有可能 reject 的 promise 手动 catch

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 0);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('B error');
  }, 1000);
}).catch((error) => {
  // 进入自身的catch回调
  console.log(error); // B error
});

Promise.all([promiseA, promiseB])
  // 能进入then回调，被reject的promise的值为undefined
  .then((res) => {
    const [a, b] = res;
    console.log(a, b); // A undefined
  })
  // 不会进入
  .catch((error) => {
    console.log(error);
  });
```

## `Promise.allSettled()`

`Promise.allSettled()`和`Promise.all()`类似，只不过它返回一个**在所有的输入 promise 都已经 fufilled 或者 rejected 后的 promise**，并带有一个对象数组，每个对象包含 promise 的结果。

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 0);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('B error');
  }, 1000);
});

Promise.allSettled([promiseA, promiseB])
  .then((res) => {
    const [a, b] = res;
    // 返回的对象包含promise的状态，以及结果
    console.log(a, b); //{status: "fulfilled", value: "A"},{status: "rejected", reason: "B error"}
  })
  .catch((error) => {
    console.log(error);
  });
```

> 相比之下，`Promise.all()`适合多个异步操作之间相互依赖的场景，而`Promise.allSettled()`更适合多个异步操作相互独立的场景

## `Promise.any()`

`Promise.any()`接收一个 promsie 可迭代对象，但只要其中有一个 promise 成功，就返回那个已经成功的 promise。本质上，它和`Promise.all()`刚好相反。

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 0);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('B error');
  }, 1000);
});

Promise.any([promiseA, promiseB])
  .then((res) => {
    // promiseA 成功，因此返回promiseA的结果
    console.log(res); // A
  })
  .catch((error) => {
    console.log(error);
  });
```

> 这个方法用于返回第一个成功的 promise 。只要有一个 promise 成功此方法就会终止，它不会等待其他的 promise 全部完成。

## `Promise.race()`

`Promise.race()`接收一个 promise 可迭代对象，但是只要输入的 promise 中有一个 promise resovle 或者 reject，返回的 Promise 就会是 resolve 或者 reject。
race 函数返回一个 Promise，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。

```js
const promiseA = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('A');
  }, 100);
});

const promiseB = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('B error');
  }, 0);
});

Promise.race([promiseA, promiseB])
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    // // promiseB先完成，并且是reject，这个promise也是reject
    console.log(error); //B error
  });
```

## `Promise.resolve()`和`Promise.reject()`

这两个 API 分别用于创建一个立即成功或者立即失败的 Promise

## 小结

- 多个异步并行，且相互没有关联，使用`Promise.allSettled()`

- 多个异步并行，相互之间有依赖，使用`Promise.all()`

- 多个异步并行，最终结果根据第一个出结果（不论成功还是失败）的 promise 而定，使用`Promise.race()`

- 多个异步并行，最终结果根据第一个成功的 promise 而定，使用`Promise.any()`
