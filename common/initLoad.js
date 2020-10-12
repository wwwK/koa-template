const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koajwt = require('koa-jwt');
const fs = require('fs');
const path = require('path');

const { systemMiddleware, db: dbConfig, customMiddleware } = require('../config');

module.exports = {
  async middlewareLoad(app) {
    await this.dbLoad();
    this.systemMiddlewareLoad(app);
    this.customMiddlewareLoad(app);
    this.routesLoad(app);
  },

  customMiddlewareLoad(app) {
    const middlewareDir = path.join(__dirname, '../middleware');

    if (fs.existsSync(middlewareDir)) {
      for (const key in customMiddleware) {
        if (Object.prototype.hasOwnProperty.call(customMiddleware, key)) {
          const middleware = customMiddleware[key];

          if (middleware.enable) {
            const filePath = path.join(middlewareDir, `${key}.js`);
            if (fs.statSync(filePath).isFile()) {
              console.log(`load ${key}`);
              const middlewareObject = require(filePath)(middleware.options);
              app.use(middlewareObject);
            }
          }
        }
      }
    }
  },

  systemMiddlewareLoad(app) {
    const {
      koaLogger, koaJwt, crossDomain, koaJson,
    } = systemMiddleware;

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

    return app;
  },

  routesLoad(app) {
    const routesDir = path.join(__dirname, '../routes');

    if (fs.existsSync(routesDir)) {
      const files = fs.readdirSync(routesDir);

      files
        .filter(file => file.includes('.') && file !== 'index.js')
        .forEach(file => {
          console.log(file);
          const filePath = path.join(routesDir, file);

          if (fs.statSync(filePath).isFile()) {
            const route = require(filePath);
            app.use(route.routes(), route.allowedMethods());
          }
        });
    }
  },

  async  dbLoad() {
    const { mysql } = dbConfig;
    if (mysql.enable) {
      try {
        const db = require('../db/mysql/models');
        await db.sequelize.authenticate();

        console.log('mysql connect success');
      } catch (error) {
        console.log('mysql connect error', error);
        throw error;
      }
    }
  },
};
