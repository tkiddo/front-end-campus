---
title: webpack 打包原理初探
date: 2021-01-13
tags:
  - Webpack
---# webpack 打包原理初探

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

## 分析模块

从模块中导入模块的语句可以找到当前模块的依赖，比如`import message from './message.js';`，但是这种做法不灵活，更好的办法是使用 JavaScript 解析器。

JavaScript 解析器的作用是读取模块内容，并将其转化为 AST，即[抽象语法树](https://baike.baidu.com/item/%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91/6129952)

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

> [AST explorer](https://astexplorer.net/)是一个在线转化 AST 的网站，你可以很方便地看到代码对应的 AST

其中`"type": "ImportDeclaration",`的子节点，就是模块引入的声明，以此来分析模块依赖更为方便。

[babel](https://babel.docschina.org/docs/en/)为我们提供了一系列工具来做这些事情。

我们使用`@babel/parser`作为 JavaScript 解析器，使用`@babel/traverse`来对 AST 进行操作，使用`@babel/core`中的`transformFromAst`方法来转译代码

```shell
npm install @babel/parser @babel/traverse @babel/core @babel/preset-env --save
```

> 我们用到的一些高级的 JS 特性，可能不能适配所有浏览器，因此需要 babel 转译，`@babel/preset-env`是一个智能预设，帮助我们按照所需环境转译代码

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

let ID = 0;

// 该函数以文件名（包含路径）为参数，返回资源对象
function createAsset(filename) {
  // 读取文件内容
  const content = fs.readFileSync(filename, 'utf-8');

  // 根据文件内容生成AST
  const ast = parser.parse(content, { sourceType: 'module' });

  // 保存依赖
  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 将依赖的值，也就是文件名添加到数组中
      dependencies.push(node.source.value);
    }
  });

  // 转译代码
  const { code } = transformFromAst(ast, null, { presets: ['@babel/preset-env'] });

  // 自增id代表模块资源的唯一标识
  const id = ID++;

  // 分析模块得到一个资源对象，包含id，文件名，转移后的代码以及依赖
  return { id, filename, code, dependencies };
}
```

## 创建模块依赖图

以上函数只是对单一的模块进行分析，我们将从入口文件开始，对其进行模块分析，然后再对其依赖模块进行分析，直到项目中所有模块都分析完，最后得到一个模块之间相互依赖的关系网，也可以叫做模块依赖图。

```js
//这个函数用于从入口文件开始分析，生成依赖图
function createGraph(entry) {
  // 从入口文件开始
  const entryAsset = createAsset(entry);

  // 我们使用一个队列来依次分析模块，刚开始队列中只有一个模块
  const queue = [entryAsset];

  // 遍历队列中的模块，刚开始只有一个模块，随后会添加进新的模块，然后继续遍历，直到剩余为空
  for (const asset of queue) {
    // 模块的依赖
    const { dependencies } = asset;

    // 这个对象用于保存依赖的模块名字于id的映射关系，便于追踪
    asset.mapping = {};

    // 因为本地模块的依赖是相对于当前模块导入的，这步是得到当前模块的目录
    const dirname = path.dirname(asset.filename);

    // 遍历模块的依赖
    dependencies.forEach((relativePath) => {
      // 结合当前模块目录和依赖相对路径得到依赖的绝对路径
      const absolutePath = path.join(dirname, relativePath);

      // 创建依赖的资源对象
      const child = createAsset(absolutePath);

      // 将依赖对象的id添加到mapping对象上，方便后期查找
      asset.mapping[relativePath] = child.id;

      // 最后，将依赖资源对象加入到队列中。
      queue.push(child);
    });
  }

  return queue;
}
```

## 合并

我们可以看一下生成的模块依赖图

```js
[
  {
    id: 0,
    filename: '../example/entry.js',
    code:
      '"use strict";\n' +
      '\n' +
      'var _message = _interopRequireDefault(require("./message.js"));\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n' +
      '\n' +
      'console.log(_message["default"]);',
    dependencies: ['./message.js'],
    mapping: { './message.js': 1 }
  },
  {
    id: 1,
    filename: '..\\example\\message.js',
    code:
      '"use strict";\n' +
      '\n' +
      'Object.defineProperty(exports, "__esModule", {\n' +
      '  value: true\n' +
      '});\n' +
      'exports["default"] = void 0;\n' +
      '\n' +
      'var _name = require("./name.js");\n' +
      '\n' +
      'var _default = "hello ".concat(_name.name, "!");\n' +
      '\n' +
      'exports["default"] = _default;',
    dependencies: ['./name.js'],
    mapping: { './name.js': 2 }
  },
  {
    id: 2,
    filename: '..\\example\\name.js',
    code:
      '"use strict";\n' +
      '\n' +
      'Object.defineProperty(exports, "__esModule", {\n' +
      '  value: true\n' +
      '});\n' +
      'exports.name = void 0;\n' +
      "var name = 'world';\n" +
      'exports.name = name;',
    dependencies: [],
    mapping: {}
  }
];
```

我们可以看到，id 为 0 的模块是入口模块，依赖模块`./message.js`的 id 为 1，然后根据 id 又可以找到数组中第二个模块，这是`mapping`对象的作用。

合并后的文件只包含一个立即执行函数`(function() {})()`，按照 CommonJS 规范，并在其中实现 require 函数，提供 module，module.exports 对象

```js
// 根据依赖图生成合并文件内容
function bundle(graph) {
  let modules = '';

  // 拼接模块字符串，将模块转译后代码包含在函数中，做到变量隔离
  graph.forEach((item, index) => {
    modules += `${item.id}:[
      function(require,module,exports){
        ${item.code}
      },
      ${JSON.stringify(item.mapping)}
    ],
    `;
  });

  // require函数的作用是根据模块id得到模块的导出对象（即module.exports）
  let result = `
  (function(modules){
    function require(id){
      // 第一个是模块代码，第二个是模块依赖
      const [fn,mapping] = modules[id];

      function localRequire(name){
        return require(mapping[name]);
      }

      const module = { exports:{} };

      fn(localRequire,module,module.exports);

      // 将模块接口暴露出去
      return module.exports;
    }
    require(0);
  })({${modules}})
  `;

  return result;
}
```

这样，我们就完成了多个模块合并到一个 js 文件中。

```js
const graph = createGraph('./entry.js');
const result = bundle(graph);

fs.writeFile(path.resolve(__dirname, 'dist.js'), result, () => {});
```

这也就是 webpack 最基本的功能实现，当然，webpack 要复杂的多。

参考：[minipack](https://github.com/ronami/minipack)
