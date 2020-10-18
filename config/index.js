module.exports = {
  server: {
    port: 5000,
  },
  db: {
    redis: {
      enable: false,
      option: {
        url: 'redis://127.0.0.1:6379/1',
      },
    },
    mysql: {
      enable: true,
      options: {
        username: 'test',
        password: '123456',
        database: 'dragonfly',
        options: {
          host: '127.0.0.1',
          port: 3306,
          dialect: 'mysql',
          timezone: '+08:00',
          query: {
            raw: true,
          },
          sync: { force: false }, // 开启，则每次将强制同步表结构（删除后重新创建）
          logging: (sql, timing) => {
            if (typeof timing === 'number' && timing > 5000) {
              console.warn(`[sequelize](${timing} ms) ${sql}`);
            }
          },
          poll: {
            max: 10,
            min: 5,
            acquire: 60000,
            idle: 30000,
          },
          define: {
            underscored: false,
            freezeTableName: true,
            charset: 'utf8mb4',
            engine: 'innodb',
            dialectOptions: {
              collate: 'utf8mb4_general_ci',
              connectTimeout: 30000,
              dateStrings: true,
              typeCast: true,
            },
            timestamps: true,
          },
          // isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          // operatorsAliases: false,
        },
      },
    },
  },
  systemMiddleware: {
    koaLogger: {
      enable: false,
      options: {},
    },
    koaJwt: {
      enable: false,
      options: {
        secret: 'abcdefg',
      },
    },
    crossDomain: {
      enable: true,
      options: {
        methods: 'PUT, POST, GET, DELETE, OPTIONS',
      },
    },
    koaJson: {
      enable: true,
      options: {},
    },
  },
  customMiddleware: {
    requestLog: {
      enable: true,
      options: {},
    },
    responseFormat: {
      enable: true,
      options: {},
    },
  },
};
