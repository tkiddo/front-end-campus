---
title: react 组件更新
date: 2020-11-11
tags:
  - JS
  - React
author: 唐凯强
---

# react 组件更新

上一节讲到组件渲染并生成 dom 然后塞入页面的过程为组件的挂载，当组件的`props`或者`state`改变时，会触发组件的更新。在更新阶段，会依次调用以下方法:

1. `static getDerivedStateFromProps()`：和挂载阶段一样，用的场景不多

2. `shouldComponentUpdate(nextProps,nextState)`:根据`shouldComponentUpdate`返回值来确定是否重新渲染，默认情况下状态改变即重新渲染。这个是性能优化点，实际项目中可以使用内置的`PureComponent`组件而不是手动编写`shouldComponentUpdate()`

3. `render()`:和挂载阶段一样，执行渲染会返回 jsx 对象

4. `getSnapshotBeforeUpdate()`:在组件发生更改时从 原 dom 中获得一些信息，使用场景不多

5. `componentDidUpdate()`：组件更新完毕，可以在此对 dom 进行操作

个人在实际开发中，用到`shouldComponentUpdate()`和`componentDidUpdate()`会比较多。前者用于性能的优化，可以阻止不必要的渲染，后者多用于更新后针对前后状态的变化做一些操作，如 ajax 请求等。

# react 组件卸载

组件从 DOM 中移除时会调用：`componentWillUnmount()`,这个方法一般执行必要的清理操作，如定时器，或者在`componentDidMount()`阶段创建的订阅等

# react 组件错误处理

react 组件在后代组件抛出错误时会执行:

- `getDerivedStateFromError()`

- `componentDidCatch()`

一般可在错误捕获时做 UI 降级渲染，保证友好性
