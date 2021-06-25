---
title: 解决小程序自定义弹出层滑动时下层页面滚动问题
date: 2021-06-25
tags:
  - 小程序
---

# 解决小程序自定义弹出层滑动时下层页面滚动问题

问题描述：在开发小程序时，在自定义弹出层内滑动时，会导致下层页面滚动。

## 场景一：弹出层内没有滚动内容

按照 uni-app 官方给出的[解决方案](https://uniapp.dcloud.io/vue-basics?id=%e7%9b%91%e5%90%ac%e4%ba%8b%e4%bb%b6)，若需要禁止蒙版下的页面滚动，可使用 `@touchmove.stop.prevent="moveHandle"`，`moveHandle` 可以用来处理 `touchmove` 的事件，也可以是一个空函数。

```html
<view class="mask" @touchmove.stop.prevent="moveHandle"></view>
```

## 场景二：弹出层内有滚动内容

如果弹出层内有滚动内容，则场景一的方案会导致弹出层内的滚动内容也无法滚动。

这种情况下，可以在页面根元素动态添加一个 no-scroll 样式，定义为`{height:100vh;overflow:hidden}`，在弹窗显示时加上，弹窗关闭时去掉，也能达到效果。

> 不过，此种方案的缺点是在弹窗关闭时加上 no-scroll 样式时页面会立即回到顶部，体验不是很好

## 场景二优化方案

在整个底层页面用`scroll-view`包裹起来，设置高度为`100vh`，并动态设置`scroll-y`属性，当显示弹出层时为`false`，关闭弹出层时为`true`。

使用这种方案时，因为底层被`scroll-view`包裹，页面的`onReachBottom`和`onPullDownRefresh`生命周期就会无效，可以使用`srcoll-view`的`@scrolltolower`和`@scrolltoupper`事件来替代
