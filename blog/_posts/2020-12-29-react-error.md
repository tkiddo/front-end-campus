---
title: react 中的错误捕获
date: 2020-12-29
tags:
  - JS
  - React
author: 唐凯强
---

# react 中的错误捕获

我们先来看个例子，现在有一个组件：

```js
const Widget = (props) => {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <div>{item.name}</div>
      ))}
    </div>
  );
};

export default Widget;
```

当我们使用这个组件时，可能会传入错误的属性（原本应是数组的属性，传入的值却是字符串）。

```js
import Widget from './application/widget';

function App() {
  return (
    <div className="App">
      <Widget list={'hello'}></Widget>
    </div>
  );
}

export default App;
```

这种情况下,javascript 会报错，导致整个程序崩溃。

仅仅因为部分 UI 的 Javascript 错误而导致整个应用崩溃，这是不应该发生的。为了解决这个问题，React 16 引入了一个新的概念：**错误边界**。

## 错误边界

错误边界是一种 React 组件，它**可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且会渲染出备用 UI**，而不是渲染崩溃了的子组件树。

根据官方的用法，如果在 class 组件中定义了`static getDerivedStateFromError()`或者`componentDidCatch()`这两个方法中任何一个时，该组件就变成了错误边界。

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

实际使用更多的是将其封装成高阶组件：

```js
const ErrorBoundary = (errorMessage) => (Comp) => {
  return class ErrorBoundaryComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false
      };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // 你同样可以将错误日志上报给服务器
      //logErrorToMyService(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <h2>{errorMessage}</h2>;
      }

      return <Comp {...this.props}></Comp>;
    }
  };
};

export default ErrorBoundary;
```

然后在组件中使用：

```js
import ErrorBoundary from './errorBoundary';
const Widget = (props) => {
  const { list } = props;

  return (
    <div>
      {list.map((item) => (
        <div>{item.name}</div>
      ))}
    </div>
  );
};

export default ErrorBoundary('something went wrong !')(Widget);
```

这样就能在组件出现错误时就不会导致整个应用崩溃，而是渲染备用 UI。

**错误边界应该放在哪里**

错误边界的粒度由你来决定，可以将其包装在最顶层的路由组件并为用户展示一个 “Something went wrong” 的错误信息，就像服务端框架经常处理崩溃一样。你也可以将单独的部件包装在错误边界以保护应用其他部分不崩溃。

## 错误边界不能捕获的异常

错误边界不能捕获以下场景中的错误：

- 事件处理

如果需要在事件处理内部捕获错误，一般使用`try/catch`语句。

- 异步代码（例如 setTimeout 或者 requestAnimationFrame 函数）

全局添加监听事件，使用`window.addEventListener()`

```js
window.addEventListener('error', (event) => {
  console.log(event);
});
// 处理异步错误
window.addEventListener('unhandledrejection', (event) => {
  console.log(event);
});
```

- 服务端渲染

- 自身错误

将边界组件和业务组件分离，各司其职，不能在边界组件中处理逻辑代码，也不能在业务组件中使用 didcatch


