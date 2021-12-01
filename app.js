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

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = server;
