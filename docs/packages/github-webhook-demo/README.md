---
title: github webhooks 自动化部署
---

> [Webhooks](https://developer.github.com/webhooks/) allow you to build or set up integrations which subscribe to certain events on GitHub.com.

通过 `webhooks` 可以订阅 `github` 项目中的各个事件，如 `push/issue` 等

以 `node` 作为脚本为例，借助 [github-webhook-handler](https://github.com/rvagg/github-webhook-handler) 这个库来实现监听以及进行某些操作。

## 搭建 Node 服务器

**由于多个项目可能要设置多个 webhook**，这里采用了 `node-github-webhook` 这个库作为示例：

```js
const http = require('http')
const createHandler = require('node-github-webhook')
const handler = createHandler({ path: '/webhook', secret: 'myhashsecret' })
const exec = require('child_process').exec

function execute(cmd, onSuccess) {
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.log(`shell 执行失败`, error))
    } else {
      onSuccess && onSuccess()
    }
  })
}

const handler = createHandler([
  // 多个仓库
  { path: '/aaa', secret: 'aaa' },
  { path: '/bbb', secret: 'bbb' }
])

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404
      res.end('no such location')
    })
  })
  .listen(5000)

handler.on('error', function(err) {
  console.error('Error:', err.message)
})

handler.on('push', function(event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )

  switch (event.path) {
    case '/aaa':
      if (event.payload.ref === 'refs/heads/master') {
        execute(
          `
          cd /code/aaa
          git pull
          tyarn
          tyarn run build
        `,
          () => {
            console.log('aaa 构建成功')
          }
        )
      }

      break

    case '/bbb':
      break

    default:
      break
  }
})
```

在服务器上跑起来！

## 设置 webhooks

进入 `github` 的某个项目，`Settings` => `Webhooks` => `Add webhook`

创建 `Webhooks`，在 `Webhooks` 的页面我们可以看到一段简短的介绍：

> Webhooks allow external services to be notified when certain events happen. When the specified events happen, we’ll send a POST request to each of the URLs you provide.

有三个选项让你填写

- `Payload URL`: 填写服务器地址 如 `http://120.79.10.11:6001/webhook` （端口和 `path` 上面设置的一致）
- `Content type`: 勾选 `application/json`
- `Secert`: `myhashsecret`

以及有勾选是否只发送 `push` 事件等等

新建好之后，我们可以尝试 `push` 一下。

接着就可以看到在服务器跑起来的服务就输出

```bash
Received a push event for 项目名 to refs/heads/master
```

这时成功实现了对 `github push` 事件的监听。监听后我们需要进行特定的操作。
