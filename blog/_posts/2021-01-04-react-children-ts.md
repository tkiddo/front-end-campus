---
title: React Children 与 Typescript
date: 2021-01-04
tags:
  - JS
  - TS
  - React
---


React 中的`children`属性是创建可重用组件的关键，因为它支持组件间的相互组合。本文就讨论几种在 typescript 中定义`children`属性类型的情况

## 使用`FC`类型

`FC` 类型是一个标准的 React 类型，我们可以在箭头函数组件中使用。`FC`代表`Function Component`。

来看例子：

```ts
type Props = {
  title: string;
};
const Page: React.FC<Props> = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);
```

`FC`是一个泛型，对不同的组件属性采用特定的类型。在上面的例子中，我们定义`Props`类型包含`title`属性。或者也可以使用接口来定义`Props`。

请注意，`children`属性在`Props`中并没有定义。其实，它已经在`FC`类型中定义了。

## 显示定义`children`属性类型

如果我们要显示地定义`children`属性类型，在 React 中有以下几种选择：

- **使用 JSX.Element**

看到例子：

```ts
type Props = {
  title: string;
  children: JSX.Element;
};
const Page = ({ title, children }: Props) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);
```

例子中`children`属性是必需的，如果我们希望它是可选的，可以在类型注释前添加`?`

```ts
type Props = {
  title: string;
  children?: JSX.Element;
};
```

如果组件的子项只有一个 React 元素，那么`JSX.Element`是没问题的。但是，多个子项的时候就不适用了。我们可以做如下调整：

```ts
type Props = {
  title: string;
  children?: JSX.Element | JSX.Element[];
};
```

- **使用`ReactChild`**

`JSX.Element`的一个缺点是不支持字符串类型。因此，我们可以将字符串添加到联合类型

```ts
type Props = {
  title: string;
  children: JSX.Element | JSX.Element[] | string | string[];
};
```

但是，问题来了，如果是数字呢？

幸运的是，有一个标准类型`ReactChild`，包含了 React 元素，字符串和数字。

```ts
type Props = {
  title: string;
  children?: React.ReactChild | React.ReactChild[];
};
```

- **使用`ReactNode`**

`React.ReactChild | React.ReactChild[]`满足了我们所有的要求，但是有点冗长。`ReactNode`是一个更简洁的方法。

```ts
type Props = {
  title: string;
  children?: React.ReactNode;
};
```

`ReactNode`允许多个元素，字符串，数字...

> `FC`泛型类型在底层也是使用了`ReactNode`

## 关于类组件

以上都是在函数组件中的应用，如果是类组件呢？

来看例子：

```ts
type Props = {
  title: string;
};
export class Page extends React.Component<Props> {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </div>
    );
  }
}
```

就像`FC`一样，`Component`类型默认包含`children`属性，而且，`children`属性的的类型也是`ReactNode`

# 小结

如果我们在函数组件中使用`FC`类型，那么`children`属性已经定义好了类型。如果我们要显示地定义`children`的类型，`ReactNode`通常是最好的选择。
