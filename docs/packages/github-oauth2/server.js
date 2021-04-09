const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const axios = require('axios');

const app = new Koa();
const router = new Router();

app.use(koaStatic(path.resolve(__dirname)));

function decodeQuery(url) {
  const params = {};
  const paramsStr = url.replace(/\.*\?/, ''); // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach((v) => {
    const d = v.split('=');
    if (d[1] && d[0]) params[d[0]] = d[1];
  });
  return params;
}

router.get('/github', async (ctx) => {
  const { code } = ctx.query;

  const client_id = '6a45431255c2bce17377';
  const client_secret = '73c0dae65694927d43c5ed053d4c73143eea62cd';
  const access_token_url = 'https://github.com/login/oauth/access_token';
  const fetch_user_url = 'https://api.github.com/user';

  // 拿到 code， 请求 access_token
  const result = await axios.post(access_token_url, {
    code,
    client_id,
    client_secret,
  });

  // 返回带有 access_token 的字符串
  // access_token=d59801d53b60486c8bcaba9e49858b5a3c04695f&scope=&token_type=bearer
  const callbackUrl = result.data;
  const { access_token } = decodeQuery(callbackUrl);

  // 拿 token 取用户的数据
  const userInfo = await axios.get(
    `${fetch_user_url}?access_token=${access_token}`,
  );
  ctx.body = userInfo.data;
});

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
  console.log('please open http://localhost:3000');
});
