const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { isValidDate, uDateFormat } = require('../scalar/date');

const Wmr = sequelize.define('wmr3', {
  id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestById: {
    type: DataTypes.STRING,
  },
  requestBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestByTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      if (isValidDate(this.getDataValue('requestByTimestamp'))) return uDateFormat(this.getDataValue('requestByTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
  },
  authorizedById: {
    type: DataTypes.STRING,
  },
  authorizedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorizedByTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      if (isValidDate(this.getDataValue('authorizedByTimestamp'))) return uDateFormat(this.getDataValue('authorizedByTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
  },
  department: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  section: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idWo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'wmr3',
  underscored: true,
  timestamps: false,
});

module.exports = {
  Wmr,
};
