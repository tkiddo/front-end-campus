# 理解 React 的 `setState`

React组件常常会包含状态，可以是控制组件显示隐藏的布尔值，也可以是表单输入框中的字符串。React组件的状态是渲染UI的基础，当组件状态改变时，组件UI也相应改变。这就使得理解“什么时候改变状态”，“如何改变状态”变得尤为重要。接下来，就来解析`setState`到底如何工作的，从而能够避免学习React中的一些常见的陷阱。

# `setState()` 的工作原理

除了组件首次挂载时的状态初始化，`setState()`是唯一可以改变状态的方式。让我们以搜索框组件作为例子：

这是状态的初始化，我们把输入框的值初始化为空字符串。

```javascript
import React from 'react';

export default class Search extends React.Component{
  constructor(){
    super(...arguments)
    this.state={
      value:''
    }
  }

  render(){
    return <input value={this.state.value}/>
  }
}
```

当状态需要更新时，我们就得调用`setState()`。

```javascript
handleChange = (event)=>{
  this.setState({
    value:event.target.value
  })
}
```

这里，我们传递给`setState()`方法一个对象。这个对象包含了我们需要更新的状态，例子中就是`value`。React将这个对象与原状态进行合并，然后根据新的状态更新组件UI。

说起来比较简单，但React在整个流程中做了很多事情，梳理一下：

1. 搜素框组件初始化状态，value 值为空
2. 用户输入字符串
3. 用户输入被捕获，并传递给`setState()`
4. React 注意到状态中value值的变化，并根据新的状态创建新的虚拟dom树
5. 对比新旧dom树找出实际更新的元素
6. 更新对应的部分
   
整个过程称为React的协调器，它并不会改变整个dom树结构，而只更新状态改变真正影响的元素。

`setState()`做的一系列事情告诉我们，**永远不要直接改变状态**。

```javascript
handleChange = (event)=>{
  this.state = {
    value:event.target.value
  }
}
```

这样子并不会让组件重新渲染。

# 给 `setState()` 传入函数

我们以一个简单的计数器为例，来进一步探讨`setState()`

```javascript
import React from 'react';

export default class Search extends React.Component{
  constructor(){
    super(...arguments)
    this.state={
      count:0
    }
  }
  
  handleAdd = ()=>{
    this.setState({
      count:this.state.count+1
    })
  }

  render(){
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleAdd}>add</button>
      </div>
    )
  }
}
```

这是一个简单计数器，每次点击数字加1。但是，当我们尝试加3时，我们可以调用3次`setState()`：

```javascript
handleAdd = ()=>{
  this.setState({
    count:this.state.count+1
  })
  this.setState({
    count:this.state.count+1
  })
  this.setState({
    count:this.state.count+1
  })
}
```

然后，我们发现，并不能起作用，调用3次最后只加了1。

我们知道，`setState()`会将新的状态与之前的合并，以上代码片段和下面的效果相同：

```javascript
Object.assign(  
  {},
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
)
```

`Object.assign()`用于从一个对象拷贝数据到目标对象。如果多次拷贝同一属性的值，则最后一次会覆盖前几次的值。

```javascript
let count = 3

const object = Object.assign({}, 
  {count: count + 1}, 
  {count: count + 2}, 
  {count: count + 3}
);

console.log(object);
// output: Object { count: 6 }
```

所以，尽管我们调用了三次`setState()`，但实际只发生了一次。如果我们要执行三次，则可以给`setState()`传递一个函数，该函数会得到最新的状态。

```javascript
handleAdd = ()=>{
  this.setState(({count})=>({count:count+1}))
  this.setState(({count})=>({count:count+1}))
  this.setState(({count})=>({count:count+1}))
}
```

# `setState()` 是异步还是同步

同样是计数器的例子，当我们在`setState()`之后立即输出count值时，发现count还是原来的值：

```javascript
handleAdd = ()=>{
  this.setState({
    count:this.state.count+1
  })
  console.log(this.state.count)
}
```

由此可以看出，调用了`setState()`之后，count并不是立刻改变，而是事件处理函数运行之后才触发改变，`setState()`是异步的。

但是，`setState()`并不总是异步的，比如：

```js
componentDidMount(){
  this.timer = setInterval(() => {
    this.setState({count:this.state.count+1});
    console.log(this.state.count);
    if(this.state.count > 5){
      clearInterval(this.timer)
    }
  },1000)
}  
```

我们发现，在计时器中`setState()`是同步的。

这就是说，**`setState()`既可以是同步的，也可以是异步的**。

那什么时候是同步，什么时候是异步呢？

- 合成事件中是异步：我们在JSX中写的事件都是合成事件，它将浏览器的原生事件进行了跨浏览器的包装。
- 生命周期函数中是异步
- 原生事件中是同步
- `setTimeout`,`setInterval`等异步执行的代码中是同步
  
如果，我们需要使用改变状态后的数据怎么办呢？

`setState()`函数还有第二个参数，是一个回调函数，会在页面重新渲染之后调用，这样就能获取到真正的状态了。

```javascript
handleAdd = () => {
  this.setState({
    count:this.state.count+1
  },() => {
    console.log(this.state.count)
  })
}
```

# 最佳实践

- 不要信任`setState()`之后的状态
- 如果要使用更新之后的状态，给`setState()`传一个回调函数
- 如果新的状态要依赖之前的状态，给`setState()`

更多文章，参见 github：[tkiddo/front-end-interview](https://github.com/tkiddo/front-end-interview)