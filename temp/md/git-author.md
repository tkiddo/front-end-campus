## github 上提交了但是 contribution 没显示

提交时 author 的邮箱和 github 上绑定的邮箱不一致。
修改邮箱

```
git config --global user.email "xxx"
```

或者临时指定邮箱

```
git commit -m 'xxx' --author 'xxx <xxx@xx>'
```
