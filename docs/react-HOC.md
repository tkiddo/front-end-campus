# react 高阶组件

我们知道高阶函数是以函数作为参数的函数，以此类推，**高阶组件是以组件作为参数，返回值为新组件的函数**。高阶组件为我们提供了一种组件逻辑复用的方式。

举例来说，现在有 A,B 两个组件，需要在组件加载时分别输出招呼语`Hello,I am A.`和`Hello,I am B`。一般来讲，分别在各自组件`componentDidMount`生命周期函数中执行即可。

```js
// A.js
import React from 'react';

const A = class extends React.Component {
  componentDidMount() {
    console.log('Hello,I am A');
  }
  render() {
    return <div>A</div>;
  }
};

export default A;

// B.js
const B = class extends React.Component {
  componentDidMount() {
    console.log('Hello,I am B');
  }
  render() {
    return <div>B</div>;
  }
};

export default B;
```

当然，这方法是可取的。但是，如果有 10 个组件甚至更多呢？再一个个地去添加就违背了代码 DRY(Don't Repeat Yourself )避免重复代码原则。这时候就需要高阶组件把公共逻辑提取出来。

我们知道，高阶组件是一个函数，并以组件作为参数。

```js
//Greet.js
import React from 'react';

export default function Greet(Component, name) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Hello,I am ${name}`);
    }
    render() {
      return <Component></Component>;
    }
  };
}
```

A 和 B 组件中的公共逻辑就不用再写了，并用高阶组件包裹

```js
//A.js
import Greet from './Greet';
import React from 'react';

const A = class extends React.Component {
  render() {
    return <div>A</div>;
  }
};

export default Greet(A, 'A');

// B.js
import Greet from './Greet';
import React from 'react';

const B = class extends React.Component {
  render() {
    return <div>B</div>;
  }
};

export default Greet(B, 'B');
```

当公共逻辑比较多时，高阶组件就非常有用，改动的时候也比较高效。

## HOC 可以做什么

除了代码复用，HOC 还可以做什么呢？

- 修改 props

高阶组件将组件作为参数，其实就是劫持了组件，将组件作为 child 渲染，上级的 props 也就传递给了 HOC，HOC 就获得了更改 props 的权限。

例如，我们对 Greet 进行修改：

```js
import React from 'react';

export default function Greet(Component, name) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Hello,I am ${name}`);
    }
    render() {
      const props = {
        ...this.props,
        message: 'Hello'
      };
      return <Component {...props}></Component>;
    }
  };
}
```

这里就在原有 props 的基础上添加了 message 属性，在经过 Greet 高阶组件包裹后，A 组件的 props 上也有了 message 属性

```js
import Greet from './Greet';
import React from 'react';

const A = class extends React.Component {
  render() {
    const { message } = this.props;
    return <div>A:{message}</div>;
  }
};

export default Greet(A, 'A');
```

我们熟悉的[react-redux](https://github.com/reduxjs/react-redux)中的 connect 就是高阶组件，做的事情其实就是把 redux 中的状态和方法添加到组件的 props 上去。

- 劫持渲染

数据加载完成之前给一个 loading 的等待 UI 是很常见的需求。用了高阶组件，我们不必每个组件手动去添加。

```js
import React from 'react';

function loading(wrappedComponent) {
  return class Loading extends React.Component {
    render() {
      if (!this.props.data) {
        return <div>loading...</div>;
      }
      return <wrappedComponent {...props} />;
    }
  };
}
```

这样就可以在数据到达组件之前显示 loading 等待 UI

## HOC 注意事项

摘自[React 官方文档](https://react.docschina.org/docs/higher-order-components.html),注意即可。

- 不要在 render 方法中使用 HOC

React 的 diff 算法（称为协调）使用组件标识来确定它是应该更新现有子树还是将其丢弃并挂载新子树。 如果从 render 返回的组件与前一个渲染中的组件相同（===），则 React 通过将子树与新子树进行区分来递归更新子树。 如果它们不相等，则完全卸载前一个子树。

- Refs 不会被传递

虽然高阶组件的约定是将所有 props 传递给被包装组件，但这对于 refs 并不适用。那是因为 ref 实际上并不是一个 prop - 就像 key 一样，它是由 React 专门处理的。如果将 ref 添加到 HOC 的返回组件中，则 ref 引用指向容器组件，而不是被包装组件。

- 务必复制静态方法

以上就是我对 React 高阶组件的一些认识，经验有限，还请指正。

更多文章，参见 github:[tkiddo/front-end-interview](https://github.com/tkiddo/front-end-interview)
