---
title: 结合Egg，入门腾讯云Cloudbase开发
date: 2021-09-23
tags:
  - Node
  - Egg
  - CloudBase
---

不想做全栈的前端不是好前端。

## 技术栈

- [Egg](https://eggjs.org/zh-cn/intro/)

- [Typescript](https://www.typescriptlang.org/)

- [腾讯云开发](https://cloud.tencent.com/document/product/876/34654)

数据库直接使用腾讯云数据库，方便快捷。

## 开始

按照[cloudbase-framework](https://github.com/Tencent/cloudbase-framework)文档：

1. 安装 CLI

```shell
npm install -g @cloudbase/cli@latest
```

2. 初始化应用

```shell
cloudbase init
```

在接下来的命令行提示中选择云环境（提前开通，前往[腾讯云](https://cloud.tencent.com/)）和应用模版为 Egg 应用。

3. 新增 Typescript 支持

官方的模版是 JS 版，因此我们要手动增加 TS 支持。

```shell
npm install typescript -D
```

创建`tsconfig.json`：

```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "strict": true,
    "noImplicitAny": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "charset": "utf8",
    "allowJs": false,
    "pretty": true,
    "noEmitOnError": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "strictPropertyInitialization": false,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "inlineSourceMap": true,
    "importHelpers": true
  },
  "exclude": ["app/public", "app/views"]
}
```

然后将原先的 js 文件改为 ts 文件，语法稍作修改即可。

在`package.json`中新增编译命令

```json
{
  "scripts": {
    "tsc": "ets && tsc -p tsconfig.json"
  }
}
```

4. 修改 Eslint 配置

因为新增了 TS 支持，则原先的 Eslint 配置要修改。

```shell
npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

修改`.eslintrc`：

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
}
```

5. 启动

得益于`egg-bin`已经内置了`ts-node`，在开发期会自动编译运行，只要配置`package.json`即可，具体可查看[文档](https://eggjs.org/zh-cn/tutorials/typescript.html#ts-node)

```json
{
  "name": "showcase",
  "egg": {
    "typescript": true,
    "declarations": true
  },
  "scripts": {
    "dev": "egg-bin dev",
    "test-local": "egg-bin test",
    "clean": "ets clean"
  }
}
```

然后,`npm run dev` 即可。

##
