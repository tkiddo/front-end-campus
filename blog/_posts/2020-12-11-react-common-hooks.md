---
title: React 常见 Hooks
date: 2020-12-11
tags:
  - JS
  - React
author: tkiddo
---

# React 常见 Hooks

上一节讲到 Hooks 出现的动机是为了解决状态逻辑复用难的问题，加强了函数组件，让开发者可以完全不适用类组件。这一节就来讲讲常见的四个 Hooks，看看 Hooks 是如何让函数组件完成类组件的功能。

- `useState()`
- `useEffect()`
- `useContext()`
- `useReducer()`

## `useState()`：状态钩子

纯函数不能有状态，所以状态维护要使用钩子，`useState()`就为函数组件引入了状态。

```js
import { useState } from 'react';

const Count = () => {
  const [number, setNumber] = useState(0);

  return (
    <div>
      <div>{number}</div>
      <button onClick={() => setNumber(number + 1)}>add</button>
    </div>
  );
};

export default Count;
```

`useState()`方法中唯一的参数是**初始 state**，例子中就是数字 0,返回值是**当前 state 以及更新 state 的函数**，例子中就是 number 和 setNumber，这里用到了 ES6 中的解构赋值。`useState()`的逻辑非常简单，它始终返回最新的状态值，更新状态只需要调用更新函数即可。

## `useEffect()`：副作用钩子

`useEffect()`用于引入副作用的操作，最常见的就是向服务器请求数据。之前，在类组件中请求数据通常放在`componentDidMount()`生命周期中，现在可以放在`useEffect()`中。

```js
import { useState, useEffect } from 'react';

const Count = () => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/mock/students')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  }, []);

  return (
    <div>
      <div>{number}</div>
      <button onClick={() => setNumber(number + 1)}>add</button>
    </div>
  );
};

export default Count;
```

`useEffect()`接收两个参数，第一个参数是函数，就是执行的副作用代码，例子中是异步请求数据；第二个参数是一个数组，存放的是 Effect 的依赖项，就是当依赖项发生变化时，`useEffect()`就会执行。

**如果依赖项没有设置，则在组件每次渲染的时候都会调用`useEffect()`；如果依赖项设置为空数组，则只在组件首次渲染时调用`useEffect()`,相当于`componentDidMount()`**

## `useContext()`：共享状态钩子

`useState()`让组件有了自己的状态，而`useContext()`提供了组件之间共享状态的方式。

比如，现在有两个组件 Message 和 Toast,我们希望他们共享同一个状态值 msg，就可以这么做。

首先，在组件外部创建 Context

```js
// context.js
import { createContext } from 'react';

const MyContext = createContext({});

export default MyContext;
```

然后，分别创建 Message 和 Toast 组件

```js
// message.js
import { useContext } from 'react';
import MyContext from './context';

const Message = () => {
  const { msg } = useContext(MyContext);
  return <div>message:{msg}</div>;
};

export default Message;
```

```js
// toast.js
import { useContext } from 'react';
import MyContext from './context';

const Toast = () => {
  const { msg } = useContext(MyContext);
  return <div>toast:{msg}</div>;
};

export default Toast;
```

最后，将两个组件包裹到同一个 Provider 中

```js
import Message from './message';
import Toast from './toast';
import MyContext from './context';

const Wrapper = () => {
  return (
    <MyContext.Provider value={{ msg: 'hello world' }}>
      <Message></Message>
      <Toast></Toast>
    </MyContext.Provider>
  );
};

export default Wrapper;
```

代码中,`useContext()`用来引入上下文对象，从中获取需要的数据属性。

## `useReducer()`：action 钩子

熟悉 redux 的同学都知道，在 redux 中，状态并不直接更改，而是通过发起 action 给状态管理器，收到 action 后，使用 reducer 计算出新的状态，即`(state, action) => newState`。

`useReducer()`也是一样的，`const [state,dispatch] = useReducer(reducer, initialState)`，它接收一个形如`(state, action) => newState`的 reducer，并返回当前 state 以及发起 action 的 dispath 方法。

同样的，以计数器为例

```js
import { useReducer } from 'react';

const initialState = {
  number: 0
};

const myReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return { ...state, number: state.number + 1 };
    case 'minus':
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
};

const Count = () => {
  const [state, dispath] = useReducer(myReducer, initialState);
  return (
    <div>
      <div>{state.number}</div>
      <button onClick={() => dispath({ type: 'add' })}>add</button>
      <button onClick={() => dispath({ type: 'minus' })}>minus</button>
    </div>
  );
};

export default Count;
```

是不是很 redux 啊。

## Hooks 使用注意

最后，说一下 Hooks 使用的注意事项：

- **只能在最顶层使用 Hook，不要在循环，条件或者嵌套函数中使用 Hook**

Hook 本质上是一组按顺序执行的函数，任何会破坏顺序的操作都是不允许的。

- **只能在 React 函数组件或者自定义 Hook 中调用**

Hook 就是为函数而生的嘛。

更多文章，参见 github：[tkiddo/front-end-interview](https://github.com/tkiddo/front-end-interview)
