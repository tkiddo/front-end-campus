---
title: axios 简介
date: 2020-10-28
tags:
  - JS
  - http
---

基于 Promise 的 HTTP 客户端，用于浏览器和 node.js

- 支持浏览器端 ajax 请求
- 支持从 node.js 发出 http 请求
- 支持 Promise API
- 支持拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防范 XSRF

## 源码目录结构

```
lib
├─adapters  请求适配器
├─cancel    取消请求
├─core      核心源码
└─helpers   辅助代码
└ axios.js  入口文件
└ defaults.js  默认配置
└ utils.js   工具
```

## axios 初始化

源码：[axios](https://github.com/axios/axios)

主要源码在 lib 目录下

从`package.json`的`main`字段看出入口文件为`index.js`,只有一句代码：

```js
module.exports = require('./lib/axios');
```

然后看到 lib 目录下的`axios.js`,核心是`createInstance`方法。

```js
// lib/axios.js
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

//......

module.exports = axios;
```

`createInstance`函数内第一步是`var context = new Axios(defaultConfig);`实例化了 Axios。接着看到`Axios.js`:

```js
// lib/core/Axios.js
function Axios(instanceConfig) {
  //将默认配置初始化
  this.defaults = instanceConfig;
  //初始化拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

//以下代码是在Axios的原型上挂载了更多方法
Axios.prototype.request = function request(config) {
  //...
};

Axios.prototype.getUri = function getUri(config) {
  //...
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    //...
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    //...
  };
});

module.exports = Axios;
```

接下来，在实例化 Axios 之后，看到`createInstance`方法内第二句:

```js
var instance = bind(Axios.prototype.request, context);
```

`bind`方法很简单：

```js
// lib/helpers/bind.js
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```

bind 方法的作用是将 axios 包裹成一个函数导出，并且当执行函数时，直接调用 request 方法。

从`axios`的 api 中可以看到这样的使用，实际上是调用了原型上的 request 方法：

```js
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

接下来，就是扩展了 instance：

```js
// lib/axios.js
// Copy axios.prototype to instance
utils.extend(instance, Axios.prototype, context);

// Copy context to instance
utils.extend(instance, context);

return instance;
```

所以最终导出的 axios 是一个函数，并在函数对象上扩展了 Axios 实例的方法。

## 默认配置

看到`defaults.js`:

```js
// lib/defaults.js
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // 针对浏览器环境和node环境做不同的适配
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  // 请求数据转化
  transformRequest: [
    function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }
  ],

  // 响应数据转化
  transformResponse: [
    function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          /* Ignore */
        }
      }
      return data;
    }
  ],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    Accept: 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
```
