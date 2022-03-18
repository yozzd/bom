const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const OUTSTANDINGPO = sequelize.define('outstandingPo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  poIssue: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      if (this.getDataValue('poIssue') === '0000-00-00' || !this.getDataValue('poIssue')) return '';
      return this.getDataValue('poIssue');
    },
  },
  poZone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poSupplier: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  poDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  poKvalue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poValue: {
    type: DataTypes.DOUBLE(18, 2),
    allowNull: false,
  },
  poKshipping: {
    type: DataTypes.STRING,
  },
  poShipping: {
    type: DataTypes.DOUBLE(18, 2),
  },
  poLt: {
    type: DataTypes.STRING,
  },
  poLpayment: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poLpayment') === '0000-00-00' || !this.getDataValue('poLpayment')) return '';
      return this.getDataValue('poLpayment');
    },
  },
  poBom: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poBom') === '0000-00-00' || !this.getDataValue('poBom')) return '';
      return this.getDataValue('poBom');
    },
  },
  poAdmin: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poAdmin') === '0000-00-00' || !this.getDataValue('poAdmin')) return '';
      return this.getDataValue('poAdmin');
    },
  },
  poFinance: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poFinance') === '0000-00-00' || !this.getDataValue('poFinance')) return '';
      return this.getDataValue('poFinance');
    },
  },
  poShipment: {
    type: DataTypes.STRING,
  },
  poEta: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poEta') === '0000-00-00' || !this.getDataValue('poEta')) return '';
      return this.getDataValue('poEta');
    },
  },
  poArrival: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poArrival') === '0000-00-00' || !this.getDataValue('poArrival')) return '';
      return this.getDataValue('poArrival');
    },
  },
  poStatus: {
    type: DataTypes.STRING,
  },
  poRemarks: {
    type: DataTypes.TEXT,
  },
  poRemarksBom: {
    type: DataTypes.TEXT,
  },
  poRemarksAdmin: {
    type: DataTypes.TEXT,
  },
  poRemarksFinance: {
    type: DataTypes.TEXT,
  },
  poRemarksWarehouse: {
    type: DataTypes.TEXT,
  },
  poCancel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  poCreatedOn: {
    type: DataTypes.DATE(6),
  },
  approvalDate: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('approvalDate') === '0000-00-00' || !this.getDataValue('approvalDate')) return '';
      return this.getDataValue('approvalDate');
    },
  },
  comp: {
    type: DataTypes.STRING,
  },
  hse: {
    type: DataTypes.STRING,
  },
  poValueUsd: {
    type: DataTypes.DOUBLE(18, 2),
  },
  poPaidUsd: {
    type: DataTypes.DOUBLE(18, 2),
  },
  poBalanceUsd: {
    type: DataTypes.DOUBLE(18, 2),
  },
}, {
  tableName: 'outstanding_po',
  underscored: true,
});

module.exports = { OUTSTANDINGPO };