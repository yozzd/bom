const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  group: {
    type: DataTypes.INTEGER,
  },
  empNo: {
    type: DataTypes.STRING,
    field: 'emp_no',
  },
  department: {
    type: DataTypes.STRING,
    get() {
      return parseInt(this.getDataValue('department'), 10);
    },
  },
  section: {
    type: DataTypes.STRING,
    get() {
      return parseInt(this.getDataValue('section'), 10);
    },
  },
  fullname: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.INTEGER,
  },
  isManager: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'pss_user',
  underscored: true,
});

User.prototype.authenticate = function compare(password) {
  if (password === this.password) {
    return true;
  }
  return false;
};

module.exports = User;
