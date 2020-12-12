<!--
 * @Description: electron 入门
 * @Author: tkiddo
 * @Date: 2020-12-04 21:31:04
 * @LastEditors: tkiddo
 * @LastEditTime: 2020-12-05 14:11:15
-->

# 用 electron 开发桌面应用

## 目录

- [electron 简介](#electron-简介)
- [开始](#开始)
  - [项目初始化](#项目初始化)
  - [安装 electron](#安装-electron)
  - [渲染进程](#渲染进程)

## electron 简介

如果你只会 html+css+js，但又想做桌面应用，那么 electron 是一个非常好的选择。Electron 基于 Chromium 和 Node.js, 让你可以使用 HTML, CSS 和 JavaScript 构建应用。我们可以把 electron 应用理解成一个套了桌面应用壳子的浏览器，因此，web 端的代码也可以直接运行。

## 开始

### 项目初始化

创建文件夹，并初始化项目

```shell
mkdir mocker

cd mocker

npm init -y
```

然后，项目中配置 Eslint 做代码检查，采用`elsint-config-airbnb-base`规范

```shell
npm install eslint eslint-config-airbnb-base --save-dev
```

### 安装 electron

鉴于 npm 安装 electron 慢的情况，官方给出的一个解决办法是从[electron/electron/releases](https://github.com/electron/electron/releases)手动下载对应的软件包放到本地目录中替代网络下载。本项目中，需要下载`electron-v11.0.3-darwin-x64.zip`和`SHASUMS256.txt`两个文件，然后放到本地缓存目录（根据平台不同，缓存目录也会不同，mac 平台是在`～/Library/Caches/electron`，Windows 平台是：`~/AppData/local/electron/Cache`或者`%LOCALAPPDATA%/electron/Cache`）。

下载完成后，再使用 npm 安装 electron 即可

```shell
npm install electron -g
```
