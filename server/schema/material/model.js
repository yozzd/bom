const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Material = sequelize.define('material', {
  MaterialCD: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  MaterialNM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MaterialDesc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'Material',
});

module.exports = {
  Material,
};
