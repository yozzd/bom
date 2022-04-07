const { format } = require('date-fns');
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { remarkBlacklist } = require('../bom/model');

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
      return format(new Date(this.getDataValue('poIssue')), 'yyyy-MM-dd');
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
      return format(new Date(this.getDataValue('poLpayment')), 'yyyy-MM-dd');
    },
  },
  poBom: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poBom') === '0000-00-00' || !this.getDataValue('poBom')) return '';
      return format(new Date(this.getDataValue('poBom')), 'yyyy-MM-dd');
    },
  },
  poAdmin: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poAdmin') === '0000-00-00' || !this.getDataValue('poAdmin')) return '';
      return format(new Date(this.getDataValue('poAdmin')), 'yyyy-MM-dd');
    },
  },
  poFinance: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poFinance') === '0000-00-00' || !this.getDataValue('poFinance')) return '';
      return format(new Date(this.getDataValue('poFinance')), 'yyyy-MM-dd');
    },
  },
  poShipment: {
    type: DataTypes.STRING,
  },
  poEta: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poEta') === '0000-00-00' || !this.getDataValue('poEta')) return '';
      return format(new Date(this.getDataValue('poEta')), 'yyyy-MM-dd');
    },
  },
  poArrival: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('poArrival') === '0000-00-00' || !this.getDataValue('poArrival')) return '';
      return format(new Date(this.getDataValue('poArrival')), 'yyyy-MM-dd');
    },
  },
  poStatus: {
    type: DataTypes.STRING,
  },
  poRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarks')) ? '' : this.getDataValue('poRemarks');
    },
  },
  poRemarksBom: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarksBom')) ? '' : this.getDataValue('poRemarksBom');
    },
  },
  poRemarksAdmin: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarksAdmin')) ? '' : this.getDataValue('poRemarksAdmin');
    },
  },
  poRemarksFinance: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarksFinance')) ? '' : this.getDataValue('poRemarksFinance');
    },
  },
  poRemarksWarehouse: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarksWarehouse')) ? '' : this.getDataValue('poRemarksWarehouse');
    },
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
      return format(new Date(this.getDataValue('approvalDate')), 'yyyy-MM-dd');
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
  arrivalStatus: {
    type: DataTypes.VIRTUAL,
    get() {
      if (!this.poArrival || !this.poBom) return '';
      if (this.poArrival > this.poBom) return 'LATE';
      return 'ONTIME';
    },
  },
  colorClass: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.poCancel) return 'outpo-cancel';
      if (!this.poFinance && this.poArrival && this.poStatus === 'Complete') return 'outpo-complete';
      if (this.poFinance && this.poArrival && this.poStatus === 'Complete') return 'outpo-close';
      if (this.poStatus === 'Partial') return 'outpo-partial';
      if (this.poFinance && !this.poArrival) return 'outpo-paid';
      return '';
    },
  },
  zone: {
    type: DataTypes.VIRTUAL,
  },
  totalPoValueUsd: {
    type: DataTypes.VIRTUAL,
  },
  totalPoPaidUsd: {
    type: DataTypes.VIRTUAL,
  },
  totalPoBalanceUsd: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.totalPoPaidUsd - this.totalPoValueUsd;
    },
  },
}, {
  tableName: 'outstanding_po',
  underscored: true,
});

module.exports = { OUTSTANDINGPO };
