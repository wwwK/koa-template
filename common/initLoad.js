const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koajwt = require('koa-jwt');
const { middleware, db: dbConfig } = require('../config');

module.exports = {
  middlewareLoad(app) {
    const {
      koaLogger, koaJwt, crossDomain, koaJson,
    } = middleware;

    app.use(
      bodyparser({
        enableTypes: ['json', 'form', 'text'],
        onerror(err, ctx) {
          ctx.throw('body parse error', 422);
        },
      }),
    );

    if (crossDomain.enable) {
      console.log('crossDomain 已启动');
      app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set(
          'Access-Control-Allow-Headers',
          'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
        );
        ctx.set('Access-Control-Allow-Methods', koaLogger.options.methods);
        if (ctx.method === 'OPTIONS') {
          ctx.body = 200;
        } else {
          await next();
        }
      });
    }

    if (koaJwt.enable) {
      console.log('koa-jwt 已启动');
      app.use(
        koajwt({ secret: koaJwt.options.secret }).unless({
          path: [/\/loginUser/],
        }),
      );
    }

    if (koaLogger.enable) {
      console.log('koa-logger 已启动');
      app.use(logger());
    }

    if (koaJson.enable) {
      console.log('koa-json 已启动');
      app.use(json());
    }

    this.dbLoad();

    return app;
  },

  dbLoad() {
    const { mysql } = dbConfig;
    if (mysql.enable) {
      // 加载配置
      const db = require('../db/mysql/models');
      db.sequelize
        .authenticate()
        .then(() => {
          console.log('mysql connect success');
        })
        .catch((error) => {
          console.log('mysql connect error', error);
          throw error;
        });
    }
  },
};
