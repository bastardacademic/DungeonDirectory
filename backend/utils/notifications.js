const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const sendNotification = (userId, message) => {
  if (io) {
    io.to(userId).emit('notification', message);
  }
};

module.exports = { initSocket, sendNotification };
