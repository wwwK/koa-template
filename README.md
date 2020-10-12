# 简介

- 了解使用 koa2 + mysql + redis 完成基础的 CURD 操作，并且结合 JWT 认证中间件。将对快速使用 mysql ， redis 和 搭建 JWT 认证 有一定的帮助
- 使用 dockerfile 完成镜像构建，快速部署 backend 服务
- 使用 docker-compose 容器编排管理，快速在一台没有 redis 和 mysql 的服务器上完整允许 backend 服务

# 更新内容

- [x] 开发基础代码
- [x] 加载机，自动化挂载 系统中间件 ，路由 ， 定制化中间件 ， 数据库连接等 
  - [ ] 系统中间件
    - [x] koa-jwt 
    - [x] koa-bodyparser
    - [x] koa-logger
    - [x] koa-json
  - [ ] 数据库
    - [x] mysql
  - [ ] 定制化中间件
    - [x] requestLog
- [x] 接入压力测试模块 loadtest 
- [x] 使用 docker 部署 
- [ ] 性能监测
- [ ] 参数验证
- [ ] 统一返回参数格式和状态

# 内容

## jwt 介绍

- 客户端登录服务器成功之后，服务器返回一个 json 对象给客户端。对象中包含认证信息以及加密信息（用于防治消息被篡改）,类似下面的 token。
- 客户端在之后的请求中可以将 json 对象保存到 cookies 中，或者保存到 headers 中的 Authorization 中，服务器将对内容进行验证，来确保是否可以登录。

```js
{
  "success": true,
  "message": "登录获取token",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRkeiIsImlkIjoxLCJpYXQiOjE1NjUwMjM4MDksImV4cCI6MTU2NTAzMTAwOX0.1338CYHuhWVBCT-qd84fw0YRnke6Aeedob1rdoyXnQk"
  }
}
```

### 优点

- 服务器无状态化，可用于多台服务器之间的登录
- 减少客户端登录次数，降低服务器压力

### 缺点

- 用于加密的密钥如何被破解，则用户可以随意伪造
- 由于客户端保存认证信息，则服务器认证通过后，在一段时间内将无法取消用户登录权限

## 部署

### 常规部署

#### 下载

```sh
git clone https://github.com/ddzyan/koa-template.git

cd koa-template
```

#### 修改配置文件

创建 mysql 中的 backend 库

config/index.js

```js
{
  redisConfig: {
    url: 'redis://127.0.0.1:6379/1'
  },
  msyqlConfig: {
    host: '127.0.0.1', // 服务器地址
    port: 3306, // 数据库端口号
    username: 'test', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'backend', // 数据库名称
    // prefix: 'api_', // 默认"api_"
    dialect: 'mysql', // 数据库类型
    timezone: 'Asia/Shanghai' // 时区
  }
}
```

#### 启动

```sh
# 安装依赖
npm i

# 创建所需要的表
npm run initDB

# 运行单元测试
npm test

# 代码覆盖率测试
npm run coverage

# 正常启动
npm start

# debug模式
npm dev

# 守护进程启动
npm i pm2 -g
pm2 start ./start.config.jss
```

### docker 部署

#### 前提

- 本地已经部署 redis 和 mysql
- mysql 远程连接账号符合配置，并且已经提前创建 backend 数据库

```sh
# 创建镜像,返回imagesId
docker build -f ./DockerFile -t ddz/back_end:1.0.0 .

# 启动
docker run -d --name back_end -p 3000:3000 -v $PWD/logs:/usr/src/back_end/logs [imagesId]
```

### docker-compose 部署

#### 前提

没有任何需求，无需部署 mysql 和 redis，无需提前创建数据库，修改配置文件等，直接允许指令快速启动

仓库：https://github.com/ddzyan/backend_docker-compose.git
