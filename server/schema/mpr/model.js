const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MPR = sequelize.define('mpr', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no: {
    type: DataTypes.STRING,
  },
  woNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.TEXT,
  },
  product: {
    type: DataTypes.TEXT,
  },
  projectName: {
    type: DataTypes.TEXT,
  },
  unit: {
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.INTEGER,
  },
  dor: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('dor') === '0000-00-00' || !this.getDataValue('dor')) return '';
      return this.getDataValue('dor');
    },
  },
  idWo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestorSection: {
    type: DataTypes.STRING,
  },
  requestorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestorTimestamp: {
    type: DataTypes.DATE(6),
    allowNull: false,
  },
  managerApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  managerTimestamp: {
    type: DataTypes.DATE(6),
    allowNull: false,
  },
  whApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  whTimestamp: {
    type: DataTypes.DATE(6),
    allowNull: false,
  },
  bomApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bomTimestamp: {
    type: DataTypes.DATE(6),
    allowNull: false,
  },
  counter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  attachment: {
    type: DataTypes.STRING,
  },
  remark: {
    type: DataTypes.TEXT,
  },
  cancel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  packing: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  hold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'mpr',
  underscored: true,
});

const MPRMODULE = sequelize.define('module', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  moduleChar: {
    type: DataTypes.STRING,
  },
  moduleName: {
    type: DataTypes.STRING,
  },
  idMpr: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'mpr_module',
  underscored: true,
});

module.exports = {
  MPR, MPRMODULE,
};
