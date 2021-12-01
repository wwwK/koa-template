const cluster = require('cluster');

const {
  server: { port },
} = require('../config');
const server = require('../app')

const unhandledRejection = new Map();
const MAX_TIME = 1000;

server.listen(port);




process.on('uncaughtException', error => {
  console.log('uncaughtException :', error);

  const killTimer = setTimeout(() => {
    process.exit(1);
  }, 1000);

  killTimer.unref(); // 一次事件轮询结束后执行

  server.close();
  if (cluster.worker) {
    cluster.worker.disconnect();
  }
});

process.on('unhandledRejection', (reason, promise) => {
  unhandledRejection.set(promise, reason);

  setTimeout(() => {
    unhandledRejection.delete(promise);
    console.log('unhandledRejection :', reason);
  }, MAX_TIME);
});

process.on('rejectionHandled', promise => {
  if (unhandledRejection.has(promise)) {
    unhandledRejection.delete(promise);
    console.log('移除未被捕获的promise map');
  }
});