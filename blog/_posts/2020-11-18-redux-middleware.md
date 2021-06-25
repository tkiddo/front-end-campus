---
title: 搞懂 redux middleware 中间件
date: 2020-11-18
tags:
  - JS
  - Redux
---

# 搞懂 redux middleware 中间件

接着上文[redux 可以这么理解](https://github.com/唐凯强/front-end-interview/blob/main/docs/redux-simple-understanding.md),今天来理解 middleware 中间件。

## 什么是中间件

在 Express 或者 Koa 中，中间件并不陌生，通常是指在接收请求和产生响应过程之间嵌入的代码。类似的，redux 中的中间件则是**嵌入在 action 发起之后，到达 reducer 之前的代码**。你可以用 redux middleware 来进行日志记录，错误处理等，比如[redux-logger](https://github.com/LogRocket/redux-logger),[redux-thunk](https://github.com/reduxjs/redux-thunk)都是比较常用的中间件

## 从零开始理解中间件

我们就用之前写好的例子：

```js
let counterState = {
  number: 0
};

const reducer = (state = counterState, action = {}) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, number: state.number + 1 };
    case 'MINUS':
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
};

const dispatch = (action) => {
  counterState = reducer(counterState, action);
};

const getState = () => counterState;

const store = {
  dispatch,
  getState
};

export default store;
```

我们现在要完成一个中间件，功能是记录状态改变前后的值。

- **最简单粗暴的方法：手动记录**

```js
const dispatch = (action) => {
  console.log(`previous state:`, getState());
  counterState = reducer(counterState, action);
  console.log(`current state:`, getState());
};
```

直接在 reducer 执行前后输出相应的状态，虽然简单，但显然不想每次都这么干。

- **重写 dispatch**

我们将原先的 dispatch 取出来，然后重写 dispatch 函数，并加入处理逻辑，就像这样：

```js
const dispatch = (action) => {
  counterState = reducer(counterState, action);
};

const next = store.dispatch;

store.dispatch = (action) => {
  console.log(`previous state:`, getState());
  next(action);
  console.log(`current state:`, getState());
};
```

这样新的 dispatch 函数就包含了记录逻辑，就像是给 dispatch 函数打了个补丁。

我们可以将重写 dispatch 的逻辑写成函数：

```js
const patchLogger = (store) => {
  const next = store.dispatch;

  store.dispatch = (action) => {
    console.log(`previous state:`, getState());
    next(action);
    console.log(`current state:`, getState());
  };
};

patchLogger(store);
```

如果需要添加多个中间处理逻辑，应该怎么办呢？

按照重写 dispatch 函数的想法，我们可以多次重写，每一次都添加相应的处理逻辑。

比如，现在有一个记录时间的中间件，功能很简单，就是输出状态改变完成的时间戳。

```js
const patchTimeStamp = (store) => {
  const next = store.dispatch;

  store.dispatch = (action) => {
    next(action);
    console.log('time:', new Date().getTime());
  };
};

patchTimeStamp(store);
```

这样，一个记录时间戳的补丁也打上去了。

现在，我们是用自己的函数将 store.dispatch 做了替换，但如果在函数中返回新的 dispatch 呢？

```js
const patchLogger = (store) => {
  const next = store.dispatch;

  return (action) => {
    console.log(`previous state:`, getState());
    next(action);
    console.log(`current state:`, getState());
  };
};

store.dispatch = patchLogger(store);

const patchTimeStamp = (store) => {
  const next = store.dispatch;

  return (action) => {
    next(action);
    console.log('time:', new Date().getTime());
  };
};

store.dispatch = patchTimeStamp(store);
```

我们不想一次次手动去替换 dispatch，为什么不写一个应用这些中间件的函数帮我们去做呢？

```js
const applyMiddleware = (middlewares) => {
  middlewares.forEach((middleware) => {
    store.dispatch = middleware(store);
  });
};

applyMiddleware([patchLogger, patchTimeStamp]);
```

这里只是传达了 redux 中`applyMiddleware()`方法的思想，具体实现要复杂得多。

这样一来，每打一个补丁，dispatch 就会替换掉原来的 dispatch，形成了 middleware 的串连。

上例中，next 是从 store 实例得到的 dispatch 函数，我们也可以显示地将 dispatch 作为参数传入：

```js
const patchLogger = (store) => {
  return (next) => {
    return (action) => {
      console.log(`previous state:`, getState());
      next(action);
      console.log(`current state:`, getState());
    };
  };
};

const patchTimeStamp = (store) => {
  return (next) => {
    return (action) => {
      next(action);
      console.log('time:', new Date().getTime());
    };
  };
};
```

然后 applyMiddleware 中每次替换时将上一次的 dispatch 作为参数传入

```js
const applyMiddleware = (middlewares) => {
  middlewares.forEach((middleware) => {
    const dispatch = store.dispatch;
    store.dispatch = middleware(store)(dispatch);
  });
};
```

对于 middleware，可以进一步将其[柯里化](https://baike.baidu.com/item/%E6%9F%AF%E9%87%8C%E5%8C%96)

```js
const patchLogger = (store) => (next) => (action) => {
  console.log(`previous state:`, getState());
  next(action);
  console.log(`current state:`, getState());
};

const patchTimeStamp = (store) => (next) => (action) => {
  next(action);
  console.log('time:', new Date().getTime());
};
```

这就是我们常见的中间件 middleware 本尊了。
