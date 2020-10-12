const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
      },
      username: {
        type: DataTypes.STRING(13),
        allowNull: false,
        comment: '账号名称',
      },
      age: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        comment: '年龄',
      },
      password: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '密码',
      },
      sex: {
        type: DataTypes.ENUM('1', '0'),
        allowNull: false,
        comment: '性别',
        get() {
          return this.getDataValue('sex') === '1' ? '男' : '女';
        },
      },
      classroomId: {
        type: DataTypes.BIGINT(10).UNSIGNED,
        references: {
          model: 'classroom',
          key: 'id',
        },
        allowNull: false,
        comment: '班级ID',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        get() {
          return moment(this.getDataValue('createdAt'))
            .utc()
            .utcOffset(480)
            .format('YYYY-MM-DD HH:mm:ss');
        },
        comment: '创建时间',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        get() {
          return moment(this.getDataValue('updatedAt'))
            .utc()
            .utcOffset(480)
            .format('YYYY-MM-DD HH:mm:ss');
        },
        comment: '创建时间',
      },
    },
    {
      comment: '用户信息表',
      timestamps: false,
      tableName: 'user',
      indexes: [
        {
          name: 'username_index',
          using: 'BTREE',
          fields: ['username'],
        },
      ],
    },
  );

  user.associate = (models) => {
    // 将 Classroom id 关联到 User 中  classroomId
    models.User.belongsTo(models.Classroom, {
      foreignKey: 'classroomId',
      onDelete: 'CASCADE',
      targetKey: 'id',
    });
  };

  return user;
};
