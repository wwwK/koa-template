const Koa = require('koa');
const http = require('http');

const initLoad = require('./common/initLoad');

const app = new Koa();

// 执行初始化，失败则不启动程序
initLoad.middlewareLoad(app);

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

const server = http.createServer(app.callback());

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = server;
