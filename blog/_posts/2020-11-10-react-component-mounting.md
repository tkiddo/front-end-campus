---
title: react 组件如何挂载
date: 2020-11-10
tags:
  - JS
  - React
---

# react 组件如何挂载

在 react 中，我们将组件渲染并生成 DOM 元素并塞入到页面中的过程称为组件的挂载。

根据官方文档，在组件挂载阶段会依次按顺序调用以下方法：

- `constructor()`:构造函数阶段，实例化组件时调用组件类中的构造函数

- `static getDerivedStateFromProps()`：不常用

- `render()`：渲染阶段，生成 jsx 对象，之后会根据 jsx 对象 生成 dom 并塞入页面

- `componentDidMount()`：组件 dom 已经在页面中

## 从 jsx 开始

通常，在 react 中组件挂载是这样的：

```js
class App extends React.Component {
  render() {
    return <div className="app">app</div>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

我们将 App 组件放到[babel](https://babel.docschina.org/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAECCAO9oFMAeAXZA7AJjASsmMOgHQDCA9gLbyVbbrQDeAUNNAE7Y7KcAUAShbsOXZOgCunLNAA8OAJYA3aKEgQAcmGrIAvACIwiAwD5j8OQHoly0wG5RAX1ZOgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cenv&prettier=false&targets=&version=7.12.3&externalPlugins=)中转译后：

```js
class App extends React.Component {
  render() {
    return /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'app'
      },
      'app'
    );
  }
}
```

其实`render()`方法内部默认调用了`React.createElement()`方法，我们再来看看该方法返回了什么：

```js
consle.log(new App().render())
//输出
{
	$$typeof:Symbol(react.element),
	props:{className:"app",children:"app"},
	type:"div",
	//...
}
```

是一个对象，就是根据这个对象在页面中构建 DOM。

这么一来，我们可以将整个挂载过程串起来：

```js
//1. 组件实例化，实例化过程中会调用constructor()函数
const app = new App();
//2. 调用静态方法getDerivedStateFromProps()
app.getDerivedStateFromProps();
//3. 调用render()方法,在render方法中，会调用React.createElement()方法，返回jsx对象
const jsxObject = app.render();
//4. 根据jsxObject生成DOM元素
const element = createDomFromObject(jsxObject);
//5. 将DOM元素塞入页面
document.getElementById('root').appendChild(element);
```

## 实验

接下来，我们来验证一下，我们在组件类中添加上生命周期方法，来查看其执行顺序

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    // 通常会在构造函数阶段初始化state
    this.state = {
      count: 1
    };
    console.log('constructor');
  }
  static getDerivedStateFromProps() {
    // 不怎么用到这个方法
    console.log('getDerivedStateFromProps');
    return {};
  }
  componentDidMount() {
    // ajax数据请求可以放在这里
    console.log('didMount');
  }
  render() {
    console.log('render');
    return <div className="app">app</div>;
  }
}
```

输出：

```md
constructor
getDerivedStateFromProps
didMount
render
```

这就是 react 组件的挂载过程
