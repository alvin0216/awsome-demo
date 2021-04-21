---
title: github action 用例
---

## 部署到远程服务器

- 新增 `.github/workflows/xxx.yml`，
- 配置 `secrets`
  - `Settings -> Secrets`

```yml
name: Deploy # 自动部署的名称
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup node 12
        uses: actions/setup-node@v2
        with:
          node-version: 12.x

      - name: Build project
        run: yarn && yarn build

      - name: Remove Prev Files
        uses: appleboy/ssh-action@master # 使用ssh链接服务器
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          password: ${{ secrets.DEPLOY_PASSWORD }}
          port: 22
          script: | # 清除缓存
            rm -rf /site/duty

      - name: Deploy to Server
        uses: hengkx/ssh-deploy@v1.0.1
        with: # 以下为参数
          HOST: ${{ secrets.DEPLOY_HOST }}
          USERNAME: ${{ secrets.DEPLOY_USER }}
          PASSWORD: ${{ secrets.DEPLOY_PASSWORD }}
          SOURCE: 'dist'
          TARGET: '/site/duty'
```

## 部署 github pages

```yml
name: github pages demo

on:
  push:
    branches:
      - master # default branch

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs-dist
```
