---
title: React Hooks 初探
date: 2020-12-14
tags:
  - JS
  - React
author: 唐凯强
---

# React Hooks 初探

在 React 中，组件的形式主要有两种，一种是 class 形式的类组件，一种是纯函数形式的函数组件。一般来讲，如果组件中不需要维护自己的状态，也不需要交互逻辑的情况下，我会选择函数组件，就当作纯展示用的静态组件，其他情况下就选择类组件了。但实际使用过程中，这两种方式的组件也存在一定的问题。

1. class Component

- 组件结构比较复杂的时候，难以理解和拆分。
- 在组件之间复用状态逻辑很困难，基本就是高阶组件层层封装
- 代码量很多

2. function Component

- 无状态组件，只适合做渲染组件，不能使用 state 和生命周期函数

## Hooks 解决了什么问题

React 从 16.8.0 开始，添加了 Hooks 功能。

Hooks 只在函数组件中能用，当然是让函数组件去完成类组件的功能。解决的问题无外乎这几个：

- 逻辑更容易复用
- 组件容易拆分
- 代码量少
- 统一使用函数组件

## 逻辑复用

逻辑复用这样的场景是非常常见的，比如很多组件都有在组件挂载完成，即`componentDidMount()`钩子函数中异步请求数据的需求。

**最简单直接的方法：用一次写一次**

最简单直接的方法，就是在需要请求数据的组件中，一个个地去写逻辑，这样会出现大量的重复代码。

```javascript
import React from 'react';

export default class Students extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:8080/mock/students')
      .then((res) => res.json())
      .then((res) => {
        const { data } = res;
        this.setState({
          list: data
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.list.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
}
```

**高阶组件**

我们会想，每个地方都有请求数据，唯一不同的是列表渲染跟数据请求 api 而已，那为什么不抽离出一个高阶组件呢？

```js
import React from 'react';

const fetchHoc = (Comp, api) => {
  return class fetchComp extends React.Component {
    constructor() {
      super(...arguments);
      this.state = {
        data: []
      };
    }
    componentDidMount() {
      fetch(api)
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            data: res.data
          });
        });
    }

    render() {
      return <Comp data={this.state.data}></Comp>;
    }
  };
};

export default fetchHoc;
```

然后，当我们写列表时，就使用高阶组件包裹一下，再把数据以 props 方式传入，就能达到复用逻辑的效果了。

```js
import React from 'react';
import fetchHoc from './fetchHoc';

class Students extends React.Component {
  render() {
    return (
      <div>
        {this.props.data.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
}

export default fetchHoc(Students, 'http://localhost:8080/mock/students');
```

如果复用逻辑很多，那岂不是要使用多个高阶组件层层包裹，难看，更难理解，更别说修改了。

**Hooks**

Hooks 的出现就是为了解决复用难的问题。如果用 Hooks，可以这么来做：

```js
import { useState, useEffect } from 'react';

const useFetch = (api) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(api)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [api]);

  return [data];
};

export default useFetch;
```

这里是一个自定义的 Hook，关于 `useState` 和 `useEffect`，接下来会说，先把功能完成，然后组件可以这么使用复用逻辑：

```js
import useFecth from './useFetch';

const Students = (props) => {
  const [data] = useFecth('http://localhost:8080/mock/students');

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default Students;
```

是不是瞬间就少了好多代码。Hooks 让我们的代码逻辑复用变得清晰简单。

关于 `useState` 和 `useEffect`，这里简单介绍下：

- `useState`: 执行后，返回一个数组，第一个值为状态值，第二个值为更新此状态值的对应方法。`useState` 函数入参为 state 初始值。
- `useEffect`：执行副作用操作。第一个参数为副作用方法，第二个参数是一个数组，填写副作用依赖项。当依赖项变了时，副作用方法才会执行。若为空数组，则只执行一次。如不填写，则每次 render 都会触发。

下一节继续探讨常用的 Hooks

更多文章，参见 github：[唐凯强/front-end-interview](https://github.com/唐凯强/front-end-interview)
