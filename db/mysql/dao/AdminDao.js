const dbModels = require('../models');

class AdminDao {
  constructor() {
    this.model = dbModels.Admin;
    this.sequelize = dbModels.sequelize;
  }

  async getUser(username, password) {
    const result = await this.model.findOne({
      where: {
        username,
        password,
      },
    });

    return result;
  }
}

module.exports = AdminDao;
