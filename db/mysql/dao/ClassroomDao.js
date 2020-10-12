const _ = require('lodash');
const dbModels = require('../models');

class ClassroomDao {
  constructor() {
    this.model = dbModels.Classroom;
    this.sequelize = dbModels.sequelize;
  }

  async delClassroomById(id) {
    const transaction = await this.sequelize.transaction();
    try {
      await dbModels.User.destroy({ where: { classroomId: id }, transaction });
      const deletedCount = await this.model.destroy({ where: { id }, transaction });
      transaction.commit();
      return deletedCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAllStudentByOption(parm) {
    const where = _.isUndefined(parm) ? {} : parm;
    const result = await this.model.findAll({
      attributes: ['classname'],
      include: [
        {
          model: dbModels.User,
          attributes: ['sex', 'age', 'username', 'createdAt'],
          where,
        },
      ],
    });

    return result;
  }

  async getAllStudentByClassroom() {
    const result = await this.getAllStudentByOption();
    const data = {};
    if (!_.isEmpty(result)) {
      for (const { Users, classname } of result) {
        data[classname] = [];
        for (const user of Users) {
          const {
            username, sex, createdAt, age,
          } = user;

          data[classname].push({
            username,
            sex,
            createdAt,
            age,
            classname,
          });
        }
      }
    } else {
      throw new Error('班级不存在');
    }
    return data;
  }

  async getAllStudentsByClassroomId(classroomId) {
    const result = await this.getAllStudentByOption({ classroomId });
    const data = [];
    if (!_.isEmpty(result)) {
      for (const { Users, classname } of result) {
        for (const user of Users) {
          const {
            username, sex, createdAt, age,
          } = user;

          data.push({
            username,
            sex,
            createdAt,
            age,
            classname,
          });
        }
      }
    } else {
      throw new Error('班级不存在');
    }
    return data;
  }
}

module.exports = ClassroomDao;
