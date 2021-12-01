/*
 * @Author: dingdongzhao
 * @Date: 2019-03-25 17:40:12
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2019-08-22 16:09:35
 */

const Redis = require('ioredis');

const {
  db: { redisConfig },
} = require('../../config/config_default');

const redis = new Redis(redisConfig.url);

redis.on('connect', () => {
  console.log('redis connected!');
});

redis.on('error', (error) => {
  console.error('redis connect error', error);
});

redis.on('end', () => {
  console.log('redis connect closed');
});

module.exports = redis;
