---
title: 详解 Content-Type 值 application/x-www-form-urlencoded ，application/json 和 multipart/form-data 的区别
date: 2021-06-30
tags:
  - http
---

在前后端分离的开发实践中，经常会碰到前端明明传了参数，但是后端告诉你取不到参数，这时候你就需要关注一下`Content-Type`这个请求头了。

HTTP 协议是以 ASCII 码传输，建立在 TCP/IP 协议之上的应用层规范。规范把 HTTP 请求分为三个部分：状态行、请求头、消息主体。 协议规定，POST 提交的数据必须放在消息主体（entity-body）中，但协议并没有规定数据必须使用什么编码方式。服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分 。

`Content-Type`比较常用的值有`application/x-www-form-urlencoded`，`application/json`和`multipart/form-data`。接下来，我们就来讲讲这三者的区别以及使用场景。

## `application/x-www-form-urlencoded`

这是 POST 请求最常见的编码方式，因为在浏览器的原生表单中如果不设置`enctype`属性，最终都会以`application/x-www-form-urlencode`的形式提交数据。以此种方式提交数据时，会对数据做序列化处理，以`key1=value1&key2=value2`的形式发送到服务端。

![在开发者工具上查看](../images/content-type/urlencoded1.png)

点击 view source

![点击 view source](../images/content-type/urlencoded2.png)

优点：兼容性好，所有浏览器都支持

缺点：在数据结构及其复杂时，服务端数据解析变得很难
