const Koa = require('koa');
const static = require('koa-static');
const Socket = require('koa-socket');
const path = require('path');

const io = new Socket({
  ioOptions: {
    pingTimeout: 10000,
    pingInterval: 5000,
  },
});

const app = new Koa();

// socket注入应用
io.attach(app);

app.use(static(path.join(__dirname, './public')));

const userMap = new Map();

app._io.on('connection', socket => {
  console.log('socket connected');
  socket.on('join', ({ account, roomId }) => {
    socket.join(roomId, () => {
      if (!userMap.has(account)) {
        userMap.set(account, { socketId: socket.id, account, socket });
      }
      const userList = [...userMap.values()].map(d => ({
        socketId: d.socketId,
        account: d.account,
      }));

      app._io
        .in(roomId)
        .emit('joined', userList, { socketId: socket.id, account }); // 发给房间内所有人
    });
  });

  // 1 v 1
  socket.on('apply', data => {
    // 转发申请
    userMap.get(data.to).socket.emit('apply', data);
  });

  socket.on('reply', data => {
    // 转发回复
    userMap.get(data.from).socket.emit('reply', data);
  });

  socket.on('1v1offer', data => {
    // 转发
    userMap.get(data.to).socket.emit('1v1offer', data);
  });

  socket.on('1v1answer', data => {
    // 转发 answer
    userMap.get(data.from).socket.emit('1v1answer', data);
  });

  socket.on('1v1ICE', data => {
    // 转发 ICE
    // console.log('ice', data)
    userMap.get(data.target).socket.emit('1v1ICE', data);
  });

  socket.on('1v1hangup', data => {
    // 转发 hangup
    userMap.get(data.account).socket.emit('1v1hangup', data);
  });
});

app._io.on('disconnect', socket => {
  const target = [...userMap.values()].find(
    item => item.socketId === socket.id,
  );
  if (!target) return false;
  userMap.delete(target.account);
  console.log(`disconnect => ${target}`);
});

// 在端口3001监听:
let port = 3001;
app.listen(port, _ => {
  console.log(`http://localhost:${port}/`);
});
