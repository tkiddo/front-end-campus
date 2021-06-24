---
title: react 组件间通信方式
date: 2020-11-12
tags:
  - JS
  - React
author: 唐凯强
---

# react 组件间通信方式

在使用 react 做项目时，组件间的通信是最基础的技术点，今天就结合实例来展示主要的几种通信方式。

- ### props

最基础的，父子组件间数据传递用的就是`props`属性。当子组件需要向父组件传递数据时，只要在 `props` 中传递一个回调函数即可

```js
// Header.js
import { useState } from 'react';
export default function Header(props) {
  const [ownState] = useState('FromHeader');
  const { name, handleClick } = props;
  return <header onClick={() => handleClick(ownState)}>{name}</header>;
}
```

```js
// App.js
import './App.css';
import { useState } from 'react';
import Header from './header';

function App() {
  const [text, setText] = useState('FromApp');
  return (
    <div className="App">
      <Header name={text} handleClick={(state) => console.log(state)} />
    </div>
  );
}

export default App;
```

- ### 借用同一父组件做桥梁传递数据

我们再创建一个 footer 组件，并通过改变 footer 的状态来改变 header 的状态,此时 App 组件作为 header 和 footer 共同的父组件，起到连接两个组件的作用

```js
//Footer.js
import { useState } from 'react';

export default function Footer(props) {
  const [ownState] = useState('FromFooter');
  const { setName } = props;
  return <footer onClick={() => setName(ownState)}>{ownState}</footer>;
}
```

```js
//App.js
import './App.css';
import { useState } from 'react';
import Header from './header';
import Footer from './footer';

function App() {
  const [text, setText] = useState('FromApp');
  return (
    <div className="App">
      <Header name={text} handleClick={(state) => console.log(state)} />
      <Footer setName={(state) => setText(state)}></Footer>
    </div>
  );
}

export default App;
```

- ### Context API

当跨越多个层级的两个组件需要通信时，通过`props`层层传递就显得不合适了，React 提供了 Context API 来简化这一过程。Context 提供了一种在组件间共享数据的方式，而不需要显示地逐层传递。

比如，现在有三个组件层层嵌套，分别是 GrandFather,Father,Son,GrandFather 的数据需要传递给 Son，一般地可以用`props`层层传递：

```js
// GrandFather.js
import { Fragment, useState } from 'react';
import Father from './father';
export default function GrandFather() {
  const [ownState] = useState('Hello');
  return (
    <Fragment>
      <div>GrandFather:{ownState}</div>
      <Father state={ownState}></Father>
    </Fragment>
  );
}

//Father.js
import Son from './son';
export default function Father(props) {
  const { state } = props;
  return (
    <Fragment>
      <div>FromGrandFather:{state}</div>
      <Son state={state}></Son>
    </Fragment>
  );
}

//Son.js
import { Fragment } from 'react';
export default function Son(props) {
  const { state } = props;
  return (
    <Fragment>
      <div>FromFather:{state}</div>
    </Fragment>
  );
}
```

这样确实可以做到，但这里只有三层，看起来并不麻烦，但如果层数很多，就显得比较臃肿了。

利用 Context API,可以直接从 GrandFather 传递数据到 Son:

```js
//GrandFather.js
import Father from './father';
export const { Provider, Consumer } = React.createContext('Hello');
export default function GrandFather() {
  const ownState = 'Hello';
  return (
    <Provider value={ownState}>
      <div>GrandFather:{ownState}</div>
      <Father></Father>
    </Provider>
  );
}

//Father.js
import Son from './son';
import { Consumer } from './grandFather';
export default function Father() {
  return (
    <Consumer>
      {(value) => {
        return <Son></Son>;
      }}
    </Consumer>
  );
}

//Son.js
import { Consumer } from './grandFather';
export default function Son() {
  return (
    <Consumer>
      {(value) => {
        return <div>FromGrandFather:{value}</div>;
      }}
    </Consumer>
  );
}
```

> 注意，在函数组件中订阅 context，需要将函数作为子组件，即[render props](https://react.docschina.org/docs/render-props.html)模式

- ### redux

更复杂一些的，比如没有任何关系的两个组件之间的通信，可以用到[redux](https://github.com/reduxjs/redux)，并不需要一上来就用 redux
