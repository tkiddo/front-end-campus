---
title: 盒子垂直水平居中
date: 2020-10-26
tags:
  - CSS
  - HTML
author: tkiddo
---

# 盒子垂直水平居中

盒子垂直水平居中的需求在项目中可以说是非常常见的，我在开发过程中常用的以下几种方法：
首先，做一下基础的布局：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        width: 500px;
        height: 500px;
        background-color: lightblue;
      }

      .box {
        width: 100px;
        height: 100px;
        background-color: darkblue;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
    </div>
  </body>
</html>
```

1. **定位**
   利用绝对定位使得盒子在父容器中水平垂直居中，是简单有效的方法，在实际开发中用的很多：

```css
.container {
  position: relative;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
}
```

但是这种方法在**子元素宽高不确定**的情况下就不适用了。由于 CSS3 的出现，有了适用性更广的方案：transform。

```css
.container {
  position: relative;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

这种方法唯一的缺点是兼容性，不过现在大多数项目都不用考虑兼容性了（个人愚见）。
基于定位，还有一种利用`margin:auto`的方法:

```css
.container {
  position: relative;
}

.box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

这种方法的前提是子元素必须有宽高。

2. **flex**
   `flex`是我在项目中用的最频繁的方法，逐渐取代了定位的方法，因为用起来太方便了，还不用考虑很多特殊情况，代码量也少。

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

3. **table 布局**
   还有一种基本不用，但我在有些博客中看到的方法，就是 table 布局

```css
.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.box {
  display: inline-block;
}
```

个人首推 flex 布局。
