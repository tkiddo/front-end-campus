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

```shell
$ git push
To github.com:tkiddo/front-end-campus.git
 ! [rejected]        feat/rollback -> feat/rollback (non-fast-forward)
error: failed to push some refs to 'git@github.com:tkiddo/front-end-campus.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

直接 push 会报错，原因是当前分支的最新提交落后于对应的远程分支，所以我们需要强行同步。

```
git push -f
```

## revert

`reset`命令会放弃目标版本之后的所有提交，如果我们只需要将其中某一次的提交还原而不影响其后的提交，比如，现在有三次提交，分别是提交一，提交二，提交三，我们发现提交二有问题，需要回退，但不想提交三也放弃掉，这时候就需要用到`revert`。`revert`的用法：

```shell
git revert commit_id
```

`revert`命令会重做目标版本，如果有冲突需要解决冲突后提交。

## 小结

`reset`和`revert`的区别在于是否保留目标版本之后的提交。
