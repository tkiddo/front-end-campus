<!--
 * @Author: tkiddo
 * @Date: 2020-12-21 09:38:26
 * @LastEditors: tkiddo
 * @LastEditTime: 2020-12-22 10:53:39
 * @Description:
-->

# 前端路由

现在，单页面应用越来越多，路由也显得越来越重要。简单地说，单页面应用中的路由就是 URL 与组件树的映射关系。因为单页面应用整个工程就一个页面，当 URL 变化时，切换的实际上是不同的组件。前端路由的核心就是监听 URL 的变化，并按照 URL 匹配到对应的组件。

前端路由主要有两种实现：

- 基于 hash

- 基于 history API

## hash

hash 哈希值，即`window.location.hash`，就是 URL 中`#`后面的部分。`#`用来指导浏览器动作，对服务器完全不起作用，http 请求不会带上`#`后面的内容。也就是说，**单单改变`#`后面的内容，浏览器只会滚动到对应的位置，不会重新加载网页。**这样，
我们就可以利用 hash 的这个特性，监听 hash 的变化来改变视图而不触发浏览器的刷新。

比如：

```html
<head>
  <style>
    .hide {
      display: none;
    }
  </style>
</head>
<body>
  <a href="#1">first</a>
  <a href="#2">second</a>
  <a href="#3">third</a>
  <ul>
    <li path="#1" class="hide">one</li>
    <li path="#2" class="hide">two</li>
    <li path="#3" class="hide">three</li>
  </ul>
</body>
```

现在有 3 个 `a` 标签，分别对应 3 个 `li` 标签。当点击`a`标签时，URL 会变化，但页面不会刷新，我们需要做的就是通过`hashchange`事件来监听 hash 的变化，并对视图做相应更改

```js
const handleHashChange = () => {
  // 当前路由的hash
  const hash = window.location.hash;
  const ul = document.querySelector('ul');
  Array.prototype.slice.call(ul.children).forEach((child) => {
    const path = child.getAttribute('path');
    // 如果path属性值和hash值相同，则显示，否则隐藏
    if (path === hash) {
      child.classList.remove('hide');
    } else {
      child.classList.add('hide');
    }
  });
};
window.addEventListener('hashchange', handleHashChange);
```

这样，基于 hash 的路由就完成了

## history API
