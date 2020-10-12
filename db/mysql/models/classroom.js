const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const classroom = sequelize.define(
    'Classroom',
    {
      id: {
        type: DataTypes.BIGINT(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
      },
      classname: {
        type: DataTypes.STRING(13),
        allowNull: false,
        comment: '班级名称',
      },
      headTeacherId: {
        type: DataTypes.BIGINT(10).UNSIGNED,
        allowNull: true,
        comment: '班主任ID',
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
      timestamps: false,
      tableName: 'classroom',
      indexes: [
        {
          name: 'classname_index',
          using: 'BTREE',
          fields: ['classname'],
        },
      ],
    },
  );
  classroom.associate = (models) => {
    // 将 Classroom id 关联到 User 中  classroomId
    models.Classroom.hasMany(models.User, {
      foreignKey: 'classroomId',
      onDelete: 'CASCADE',
      targetKey: 'id',
    });
  };

  return classroom;
};
