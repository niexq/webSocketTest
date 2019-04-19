'use strict';

require('colors');
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// 假装是数据库用户登录信息
const userInfo = [{
  id: 8000000,
  name: '张三',
  age: '18',
  token: '3456db5ea3a07afbafc59bc3fc2fbbcd',
}, {
  id: 9000000,
  name: '李四',
  age: '18',
  token: '4567db5ea3a07afbafc59bc3fc2fbbcd',
}];

// 用于缓存用户信息
const socketIdOfUserId = {};

var chat = io.of('/chat').on('connection', function(socket) {

  // socket.emit('a message', {
  //   that: 'only',
  //   '/chat': 'will get',
  // })

  // chat.emit('a message', {
  //   everyone: 'in',
  //   '/chat': 'will get',
  // })

  socket.on('chatSocketBind', async (userId, token) => {
    if (!await validateToken(userId, token)) {
      invalidTokenWarning(socket);
    } else {
      await saveYH2Socket(userId, socket.id);
      socket.emit('notify', 'socketBindReply', userId, '你好，我是chat服务器，你已经启动和我socket连接，我有chat消息会主动联系你的');
    }
  });

  socket.on('inputMessageType', function (userId, userName, message) {
    console.error('~~~~~chat服务器接收到的inputMessageType：', userId, message);
    socket.emit('notify', 'inputMessageTypeReply', userId, `【what?${message}】? 不要心急，有消息我会主动联系你的。。`);
    setTimeout(() => {
      socket.emit('notify', 'broadcastMessage', '', `【广播消息】我是chat服务器，现在插播一条广播，${userName}很闲。。。`);
    }, 3000)

    setTimeout(() => {
      socket.emit('notify', 'broadcastMessage', '', `【广播消息】我是chat服务器，现在插播一条广播，今天下班后集体看电影【复联4】。。。`);
    }, 8000)

    // 此条广播客户端暂未处理
    setTimeout(() => {
      socket.broadcast.emit('broadcastbroadcast', '【广播消息】我是chat服务器，这是socketio官方DEMO广播消息');
    }, 10000);
  })

});

const news = io.of('/news').on('connection', function(socket) {

  socket.on('newsSocketBind', async (userId, token) => {
    if (!await validateToken(userId, token)) {
      invalidTokenWarning(socket);
    } else {
      await saveYH2Socket(userId, socket.id);
      socket.emit('notify', 'socketBindReply', userId, '你好，我是news服务器，你已经启动和我socket连接，我有news消息会主动联系你的');
    }
  });

})


server.listen(8899);

async function validateToken(userId, token) {
  if (!token) return false;
  
  // // 此处实际业务可连对应用户应用程序状态是否正常
  // await knex('userApplicationStatus').where({
  //   userId,
  //   token,
  //   status: '1',
  // });

  // 为了方便此处用全局数组方式
  return userInfo.some(user => user.token === token);
}

async function saveYH2Socket(userId, socketId) {
  // // 此处实际业务可缓存用户相关信息
  // await redisClient.setAsync('socket_' + userId, socketId);

  // 为了方便此处用了全局d对象方式
  socketIdOfUserId[userId] = socketId;
}

function invalidTokenWarning(socket) {
  // 前端可提示重新登录
  socket.emit('notify', 'TOKEN_INVALID', '当前用户token异常');
}


console.error('websocket test server start'.green);