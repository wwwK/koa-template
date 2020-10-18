![ci/cd](https://github.com/ddzyan/koa-template/workflows/Nodejs-backend/badge.svg)
# 简介

基于 koa 改造，可以开箱即用的后端框架，实现的功能如下：
- 通过配置文件自动化加载初始插件，支持自定义插件热插拔配置
    1. 自动挂载路由
    2. 按照顺序挂载自定义中间件，支持传入参数配置
    3. 自动化挂载 mysql , redis 服务
- 异常处理，奔溃优雅退出
- github workflows ci/cd 基础模板配置，高效实现代码开发和持续集成
- 负载测试 load-test 模板
- 基础 eslint 配置
- docker , docker-compose 配置模板
- pm2 多进程部署模板


## 使用
```shell
git clone https://github.com/ddzyan/koa-template.git

cd koa-template

npm install 

# 启动
npm start 

# 单元测试

npm test
```

如需定制需要修改 config/index.js 配置