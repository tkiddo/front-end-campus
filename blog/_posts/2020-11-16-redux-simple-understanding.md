---
title: redux 可以这么理解
date: 2020-11-16
tags:
  - JS
  - Redux
---

经常会被问到‘redux 是什么’，‘如何去理解 redux’等类似的问题。我想最佳的答案，应该就是按照 redux 的核心概念和原则去实现一个简易的状态管理方案。这里就以一个简单的计数器为例，组成很简单，一个展示区和两个按钮，分别是加和减：

```js
import React from 'react';

export default class Count extends React.Component {
  handleAdd = () => {};
  handleMinus = () => {};
  render() {
    return (
      <div>
        <span></span>
        <button onClick={this.handleAdd}>add</button>
        <button onClick={this.handleMinus}>minus</button>
      </div>
    );
  }
}
```

然后，在创建一个`store.js`来写状态管理逻辑。

只要你用过 redux，就应该知道 state，action 和 reducer。

- **state**

状态就是包含我么所需要数据的对象，在本例中可以是这样的：

```js
let counterState = {
  number: 0
};
```

redux 原则一，**单一数据源**。很好理解，我想要 `number`，就只从 ``counterState` 中找。

但是，我们不把`counterState`暴露出去，因为 redux 的原则之二是**state 是只读的，不能直接更改**。

那该怎么得到我们需要的状态数据呢？

写个函数就可以了：

```js
export const getState = function() {
  return counterState;
};
```

那么，当我们需要读取状态时，执行`getState()`函数即可。

- **action**

redux 中的 action 其实就是个简单对象，比如：

```js
{
	type:'ADD',
	payload:2,
	//...
}
```

我想在 redux 中引入 action 概念的原因大概是让我们可以非常直观地看到数据将要怎么变化，从而对数据的掌控力会更强，让一切都朝着预期的方向走。比如这里的`{type:'ADD'}`,从字面即可理解是将计数器加一

- **reducer**

如果说 action 告诉我们即将执行什么，那么 reducer 就是真正执行的操作。

**reducer 接收 state 和 action，根据 action 中的 type 属性执行相应的操作，并返回新的 state**。

```js
const reducer = function(state = counterState, action = {}) {
  switch (action.type) {
    case 'ADD':
      return { ...state, number: state.number + 1 };
    case 'MINUS':
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
};
```

'ADD'执行加一，'MINUS'执行减一，简洁明了。

这里为什么不在原 state 上直接修改，而是将 state 浅拷贝呢？

redux 的原则三,**使用纯函数执行修改**。

> 简单来说，一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数。显然，改变原有的 state 会产生副作用。

还差一步，更改数据需要发起一个 action,需要暴露一个发起函数让外部可以调用：

```js
export const dispatch = function(action) {
  counterState = reducer(counterState, action);
};
```

完整的`store.js`:

```js
let counterState = {
  number: 0
};

const reducer = function(state = counterState, action = {}) {
  switch (action.type) {
    case 'ADD':
      return { ...state, number: state.number + 1 };
    case 'MINUS':
      return { ...state, number: state.number - 1 };
    default:
      return state;
  }
};

export const dispatch = function(action) {
  counterState = reducer(counterState, action);
};

export const getState = function() {
  return counterState;
};
```

应用到组件中，我们用`setState`来触发状态更新后的重新渲染。

```js
import React from 'react';
import { getState, dispatch } from './store';

export default class Count extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      text: 'init'
    };
  }
  handleAdd = () => {
    //发起一个ADD的action
    dispatch({ type: 'ADD' });
    this.setState({ text: 'add' });
  };
  handleMinus = () => {
    //发起一个MINUS的action
    dispatch({ type: 'MINUS' });
    this.setState({ text: 'minus' });
  };
  render() {
    return (
      <div>
        {/* getState()获取最新的状态 */}
        <span>{getState().number}</span>
        <button onClick={this.handleAdd}>add</button>
        <button onClick={this.handleMinus}>minus</button>
      </div>
    );
  }
}
```

当然，redux 比这复杂得多，这里仅用一个小例子来说明一下我的理解，望各位看官批评指正。
