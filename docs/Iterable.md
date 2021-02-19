<!--
 * @Author: tkiddo
 * @Date: 2021-02-19 10:02:29
 * @LastEditors: tkiddo
 * @LastEditTime: 2021-02-19 10:50:02
 * @Description:
-->

# ES6 迭代器入门

原文：[https://codeburst.io/a-simple-guide-to-es6-iterators-in-javascript-with-examples-189d052c3d8e](https://codeburst.io/a-simple-guide-to-es6-iterators-in-javascript-with-examples-189d052c3d8e)

迭代器是 ES6 中新引入的用于遍历任何数据集合的方法，在多种场景中有广泛的应用。

本文将从概念上理解什么是迭代器以及用示例展示如何使用。我们还将看到其在 JavaScript 中的一些实现。

## 引言

假设你有这样一个数组：

```js
const myFavouriteAuthors = ['Neal Stephenson', 'Arthur Clarke', 'Isaac Asimov', 'Robert Heinlein'];
```

现在，你需要将其中的每一个值取出，将其打印在屏幕上，或者进行其他操作。很简单地，我们可以使用`for`,`while`,`for-of`这些循环方法对其进行循环遍历。就像这样：

```js
// for loop
for (let index = 0; index < myFavouriteAuthors.length; i++) {
  console.log(myFavouriteAuthors[index]);
}

// while loop
let index = 0;
while (index < myFavouriteAuthors.length) {
  console.log(myFavouriteAuthors[index++]);
}

// for-of loop
for (const value of myFavouriteAuthors) {
  console.log(value);
}
```

现在，假设将之前的数组改为以下结构：

```js
const myFavouriteAuthors = {
  allAuthors: {
    fiction: ['J.K.Rowling', 'Dr.Seuss'],
    scienceFiction: ['Neal Stephenson', 'Arthur Clarke'],
    fantasy: ['J.R.R.Tolkien', 'Terry Pratchett']
  }
};
```

现在，`myFavouriteAuthors`是一个包含另一个对象`allAuthors`的对象，`allAuthors`包含三个数组，`fiction`，`scienceFiction`和`fantasy`。

当我们