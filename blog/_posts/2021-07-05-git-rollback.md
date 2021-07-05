---
title: git 回滚版本
date: 2021-07-05
tags:
  - Git
---

Git 中回滚代码的方式主要有两种，`reset` 和 `revert`。

## reset

`reset` 的用法：

```shell
git reset --hard commit_id
```

其中 `commit_id` 可以通过 `git log` 获得。

```shell
$git log
commit 20b5a3345a16f7de21207710d016614c2c2b2bbc (HEAD -> develop)
Author: tangkaiqiang <justforgit@163.com>
Date:   Mon Jul 5 14:38:05 2021 +0800

    version 1

commit e0bee30e87214367362a33ec05a759c0b4727f8c (origin/develop)
Author: tangkaiqiang <justforgit@163.com>
Date:   Thu Jul 1 15:48:47 2021 +0800

    content-type
```

`git reset` 可以直接选择 `commit_id` 来回退到具体的版本，也可以用相对于当前版本的提交次数来回退。在 Git 中， HEAD 用来保存当前版本，上一个版本就是`HEAD^`，上上个版本就是`HEAD^^`，往上 100 个版本可以写成`HEAD~100`。

```shell
git reset --hard HEAD^
```

回滚代码只是影响本地代码的版本，而不会影响远程仓库中的代码，所以要`push`到远程仓库。
