/*
 * @Author: dingdongzhao
 * @Date: 2019-08-18 23:38:10
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2019-08-19 16:13:22
 */
const _ = require('lodash');
const dbModels = require('../models');

class UserDao {
  constructor() {
    this.model = dbModels.User;
    this.sequelize = dbModels.sequelize;
  }

  async createUser(parm) {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await dbModels.Classroom.findOne({
        where: {
          id: parm.classroomId,
        },
        transaction,
        lock: true,
      });

      if (!_.isEmpty(result)) {
        const result1 = await dbModels.User.findOrCreate({
          where: {
            username: parm.username,
          },
          defaults: parm,
          transaction,
        });
        if (!result1[1]) {
          throw new Error('username 已经存在');
        }
        await transaction.commit();
        return result1[0];
      }

      throw new Error('教室ID不存在');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateUserById(parm) {
    const transaction = await this.sequelize.transaction();
    try {
      const userInfo = await this.model.findOne({ where: { id: parm.id }, transaction, lock: true });
      if (_.isEmpty(userInfo)) {
        throw new Error('user id 不存在');
      } else {
        Object.assign(userInfo, parm);
        const updateUser = await userInfo.save({
          transaction,
        });

        await transaction.commit();
        return updateUser.dataValues;
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserById(id) {
    const result = await this.model.findOne({
      where: { id },
      attributes: ['id', 'sex', 'age', 'username', 'createdAt'],
      include: [
        {
          model: dbModels.Classroom,
          attributes: ['classname'],
        },
      ],
    });

    if (!_.isEmpty(result)) {
      if (!_.isEmpty(result.dataValues.Classroom)) {
        const {
          username,
          sex,
          createdAt,
          age,
          dataValues: {
            Classroom: { classname },
          },
        } = result;
        return {
          id,
          username,
          sex,
          createdAt,
          age,
          classname,
        };
      }
      throw new Error('获取不到班级属性');
    } else {
      throw new Error('userId 不存在');
    }
  }
}

module.exports = UserDao;
