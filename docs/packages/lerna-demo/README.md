---
title: lerna + yarn workspaces
---

- [lerna 中文](http://www.febeacon.com/lerna-docs-zh-cn/routes/commands/)
- [基于 lerna 和 yarn workspace 的 monorepo 工作流](https://zhuanlan.zhihu.com/p/71385053)
- [lerna+yarn workspace+monorepo 项目的最佳实践](https://juejin.cn/post/6844903918279852046)

## 初始化

```bash
lerna init --independent # 初始化 独立模式
```

`lerna.json`

```json
{
  "packages": ["docs/packages/*", "docs/webpack/*"],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true,
  "command": {
    "bootstrap": {
      "hoist": true
    }
  }
}
```

`packages.json`

```bash
"workspaces": ["docs/packages/*", "docs/webpack/*"]
```

这里使用了 [yarn workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)

## 命令

```bash
lerna clean # 清除所有子包的缓存
lerna bootstrap --hosit # 使用 yarn workspaces 之后好像有问题，建议使用下面的命令

yarn workspace 包名 add vite antd # 会安装到根目录
yarn install # 等价于 lerna bootstrap --npm-client yarn --use-workspaces
lerna run dev --scope=vite-ts-demo  --stream # 跑项目
```

lerna 添加子包之间的依赖：

```bash
lerna add 包1 --scope 包2 包3
```

管理包的发布等

```bash
lerna publish
```
