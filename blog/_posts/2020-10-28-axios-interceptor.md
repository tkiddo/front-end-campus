---
title: axios 拦截器
date: 2020-10-28
tags:
  - JS
  - http
---

## axios 拦截器

在`Axios.js`中，构造函数是这样的：

```js
// lib/core/Axios.js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

这里除了配置默认设置外，还配置了拦截器，分别为请求拦截器（在请求发起之前运行）和响应拦截器（在得到响应后运行）。

看到`InterceptorManager`构造函数:

```js
// lib/core/InterceptorManager.js

'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
```

拦截器管理器维护一个任务数组`handlers`

拦截器管理有 3 个方法：

- use:往数组尾部添加拦截器，返回其在数组中的索引

- eject:按索引删除拦截器

- forEach:遍历拦截器

拦截器具体如何操作，看到`Axios.js`中`request`方法:

```js
// lib/core/Axios.js

Axios.prototype.request = function request(config) {
  // ...一些合并配置的操作，和拦截器无关
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // 这里开始对拦截器进行操作
  // Hook up interceptors middleware
  // dispatchRequest为发送请求操作，undefined为了保证数组内个数成双
  var chain = [dispatchRequest, undefined];
  // config可以在链式调用中传递
  var promise = Promise.resolve(config);

  //遍历请求拦截器，并添加到数组的头部
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  //遍历响应拦截器，并添加到数组的尾部
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // promise链式调用
  while (chain.length) {
    // 从数组中提取前两个，分别是拦截器中的fulfilled和rejected，因为是成对提取，所以会有chain中的undefined
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

> 这里需要注意的一点是，添加拦截器到`handlers`数组是尾部添加`push`,而将请求拦截器添加到链式调用的数组`chain`中用的是头部添加`unshift`，所以真正执行请求拦截器的顺序和添加时的顺序是相反的，而响应拦截器的顺序是相同的

举个例子：

```js
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    console.log(1);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    console.log(2);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(config) {
    // Do something before request is sent
    console.log(3);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(config) {
    // Do something before request is sent
    console.log(4);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
```

这里添加了两个请求拦截器和两个响应拦截器,实际的链式操作过程为:

```js
Promise.then(request[1].fulfilled, request[1].rejected)
  .then(request[0].fulfilled, request[0].rejected)
  .then(dispatchRequest, undefined)
  .then(response[0].fulfilled, response[0].rejected)
  .then(response[1].fulfilled, response[1].rejected)
  .then();
```

所以控制台输出为 2-1-3-4
