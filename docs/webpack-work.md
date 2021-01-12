<!--
 * @Author: tkiddo
 * @Date: 2021-01-12 15:17:24
 * @LastEditors: tkiddo
 * @LastEditTime: 2021-01-12 17:10:49
 * @Description:
-->

# webpack 打包原理初探

webpack 是当前非常流行的前端打包工具，因而面试中会经常被问到 webpack 打包原理的问题。

本文就以打包多个本地 js 文件到一个输出文件为目的，来实现一个简易的 webpack，从而理解其工作原理。

## 准备材料

如今，我们都习惯使用 ES6 Module。比如，现在就有三个 js 模块

```js
// entry.js
import message from './message.js';
console.log(message);

//message.js
import { name } from './name.js';

export default `hello ${name}!`;

//name.js
export const name = 'world';
```

我们要做的，就是将者三个 js 模块打包到一个 js 中。

## 从 CommonJS 说起

我们知道，服务器端的 Node.js 遵循 CommonJS 规范，该规范的核心思想是允许模块通过 require 方法来同步加载所要依赖的其他模块，然后通过 exports 或 module.exports 来导出需要暴露的接口。而浏览器不兼容 CommonJS 的根本原因，就在于缺少 require，exports 以及 module 这三个变量（global 在浏览器中对应 window）。

比如：

```js
// a.js
const name = 'a';
module.exports = {
  name
};

// index.js
const { name } = require('./a.js');
```

`require`的原理也很简单，就是解析文件路径，读取内容，然后将暴露（exports 或者 module.exports）的接口返回

简单实现`require`即：

```js
const fs = require('fs');
const path = require('path');

function localrequire(relativePath) {
  const dirname = path.dirname(relativePath);
  const content = fs.readFileSync(path.join(dirname, relativePath),,'utf-8').toString();

  const fn = function (module, exports, require) {
    eval(content);
  };

  const module = { exports: {} };

  fn(module, module.exports, localrequire);

  return module.exports;
}
```

如果你看过 webpack 打包后输出的文件，就会发现有这么一段：

```js
// The require function
function __webpack_require__(moduleId) {
  // Check if module is in cache
  if (__webpack_module_cache__[moduleId]) {
    return __webpack_module_cache__[moduleId].exports;
  }
  // Create a new module (and put it into the cache)
  var module = (__webpack_module_cache__[moduleId] = {
    // no module.id needed
    // no module.loaded needed
    exports: {}
  });

  // Execute the module function
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  // Return the exports of the module
  return module.exports;
}
```

webpack 正是提供了这三个变量来实现了 CommonJS 模块。

## 分析模块中的依赖

从模块中导入模块的语句可以找到当前模块的依赖，比如`import message from './message.js';`，但是这种做法不灵活，更好的办法是使用 JavaScript 解析器。

JavaScript 解析器的作用是读取模块内容，并将其转化为 AST，即![抽象语法树](https://baike.baidu.com/item/%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91/6129952)

比如：

```js
// entry.js
import message from './message.js';
console.log(message);
```

转化成 AST，是这样的：

```json
{
  "type": "Program",
  "start": 0,
  "end": 66,
  "body": [
    {
      "type": "ImportDeclaration",
      "start": 0,
      "end": 31,
      "specifiers": [
        {
          "type": "ImportSpecifier",
          "start": 8,
          "end": 12,
          "imported": {
            "type": "Identifier",
            "start": 8,
            "end": 12,
            "name": "name"
          },
          "local": {
            "type": "Identifier",
            "start": 8,
            "end": 12,
            "name": "name"
          }
        }
      ],
      "source": {
        "type": "Literal",
        "start": 19,
        "end": 30,
        "value": "./name.js",
        "raw": "'./name.js'"
      }
    },
    {
      "type": "ExportDefaultDeclaration",
      "start": 33,
      "end": 65,
      "declaration": {
        "type": "TemplateLiteral",
        "start": 48,
        "end": 64,
        "expressions": [
          {
            "type": "Identifier",
            "start": 57,
            "end": 61,
            "name": "name"
          }
        ],
        "quasis": [
          {
            "type": "TemplateElement",
            "start": 49,
            "end": 55,
            "value": {
              "raw": "hello ",
              "cooked": "hello "
            },
            "tail": false
          },
          {
            "type": "TemplateElement",
            "start": 62,
            "end": 63,
            "value": {
              "raw": "!",
              "cooked": "!"
            },
            "tail": true
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

其中`"type": "ImportDeclaration",`的子节点，就是模块引入的声明，以此来分析模块依赖更为方便。

我们使用`@babel/parser`作为 JavaScript 解析器。

```js
function createAsset(filename) {}
```
