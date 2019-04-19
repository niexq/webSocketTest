'use strict';

// 此部分代码忽略，可根据实际业务加入redis，用户id对应socketId

const socket = require('socket.io-emitter')(redisClient).of('/saas');

const redisClientAsync = require('./redisConnect');


module.exports = {
  async sendMessage(yhid, type, message) {
    const socketId = await redisClientAsync.getAsync('socket_' + yhid);
    if (!socketId) return;
    socket.to(socketId).emit('notify', type, message);
  },
};
