const _ = require('lodash');
const redis = require('./redisInit');

const ALL_USER = 'alluser';
const ADD_SUCCESS = 'ok';

class User {
  /**
   *
   * @description 添加用户到redis
   * @static
   * @param userObject {object} {
   *     id:string, username:string, phone:string, createAt:string
   *   } id:用户id username:名字 phone:电话 createAt:创建时间
   * @returns isAdd {bool} true:添加成功 false:添加失败
   * @memberof RedisMethod
   */
  static async addUser(param) {
    const isSuccess = await redis.hmset(ALL_USER, param.id, JSON.stringify(param));

    return _.isEqual(isSuccess, ADD_SUCCESS);
  }

  /**
   *
   * @description 根据用户ID删除缓存用户信息
   * @static
   * @param id {int} 用户ID
   * @memberof RedisMethod
   */
  static async delUserById(id) {
    const isDel = await redis.hdel(ALL_USER, id);
    return isDel;
  }

  /**
   *
   * @description 获取所有用户
   * @static
   * @returns
   * @memberof RedisMethod
   * @returns Promise<[users]>
   */
  static async getUsers() {
    const users = [];
    const usersStr = await redis.hgetall(ALL_USER);
    for (const userStr of Object.values(usersStr)) {
      users.push(JSON.parse(userStr));
    }

    return users;
  }

  static async updateUser(param) {
    const usersStr = await redis.hgetall(ALL_USER);
    for (const id of Object.keys(usersStr)) {
      if (Number.parseInt(id) === param.id) {
        const isSuccess = await redis.hmset(ALL_USER, param.id, JSON.stringify(param));
        return _.isEqual(isSuccess, ADD_SUCCESS);
      }
    }
    return false;
  }

  static async clearCache() {
    const result = await redis.flushdb();
    return result;
  }
}

module.exports = User;
