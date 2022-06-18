const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Employer = sequelize.define('employer', {
  nk: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  section: {
    type: DataTypes.INTEGER,
  },
  level: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'employer',
});

module.exports = {
  Employer,
};
