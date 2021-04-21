const chalk = require('chalk');
const http = require('http');
const createHandler = require('node-github-webhook');
const exec = require('child_process').exec;
const handler = createHandler([
  // 多个仓库
  { path: '/note', secret: 'xxx' },
]);
const log = console.log;

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(5000);

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('push', function (event) {
  log(
    chalk.blue('Received a push event for %s to %s'),
    event.payload.repository.name,
    event.payload.ref,
  );

  switch (event.path) {
    case '/note':
      if (event.payload.ref === 'refs/heads/master') {
        execute(
          `
          cd /code/note
          git pull
          tyarn
          tyarn run build
          rm -rf /site/note
          cp -r public /site/note
        `,
          () => {
            console.log('====> note 构建成功');
          },
        );
      }
      break;

    default:
      // 处理其他
      console.log('======= 暂无配置 ======');
      break;
  }
});

function execute(cmd, onSuccess) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      log(chalk.bold.red(`shell 执行失败`, error));
    } else {
      onSuccess && onSuccess();
    }
  });
}

log(chalk.white.bold.bgMagenta('webhook 启动.......'));
