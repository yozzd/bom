const { format } = require('date-fns');
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { isValidDate, uDateFormat } = require('../scalar/date');
const { remarkBlacklist } = require('../bom/model');

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
    get() {
      return this.getDataValue('no') || '######';
    },
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
      return format(new Date(this.getDataValue('dor')), 'yyyy-MM-dd');
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
    type: DataTypes.DATE,
    get() {
      if (isValidDate(this.getDataValue('requestorTimestamp'))) return uDateFormat(this.getDataValue('requestorTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
  },
  managerApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  managerTimestamp: {
    type: DataTypes.DATE,
    get() {
      if (isValidDate(this.getDataValue('managerTimestamp'))) return uDateFormat(this.getDataValue('managerTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
  },
  whApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  whTimestamp: {
    type: DataTypes.DATE,
    get() {
      if (isValidDate(this.getDataValue('whTimestamp'))) return uDateFormat(this.getDataValue('whTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
  },
  bomApproved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bomTimestamp: {
    type: DataTypes.DATE,
    get() {
      if (isValidDate(this.getDataValue('bomTimestamp'))) return uDateFormat(this.getDataValue('bomTimestamp'), 'yyyy-MM-dd HH:mm:ss');
      return '';
    },
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
    get() {
      return remarkBlacklist.includes(this.getDataValue('remark')) ? '' : this.getDataValue('remark');
    },
  },
  cancel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  packing: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  hold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'mpr',
  underscored: true,
  timestamps: false,
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
  timestamps: false,
});

const MPRITEM = sequelize.define('item', {
  id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  bomDescription: {
    type: DataTypes.STRING,
  },
  bomSpecification: {
    type: DataTypes.TEXT,
  },
  bomModel: {
    type: DataTypes.STRING,
  },
  bomBrand: {
    type: DataTypes.STRING,
  },
  bomQty: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomUnit: {
    type: DataTypes.STRING,
  },
  bomQtyRqd: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomQtyBalance: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomQtyStock: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomEta: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('bomEta') === '0000-00-00' || !this.getDataValue('bomEta')) return '';
      return format(new Date(this.getDataValue('bomEta')), 'yyyy-MM-dd');
    },
  },
  bomQtyRec: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomDateRec: {
    type: DataTypes.DATE,
    get() {
      if (this.outstandingPo) return this.outstandingPo.poArrival;
      if (this.getDataValue('bomDateRec') === '0000-00-00' || !this.getDataValue('bomDateRec')) return '';
      return format(new Date(this.getDataValue('bomDateRec')), 'yyyy-MM-dd');
    },
  },
  bomCurrSizeC: {
    type: DataTypes.STRING,
  },
  bomCurrSizeV: {
    type: DataTypes.STRING,
    get() {
      return parseFloat(this.getDataValue('bomCurrSizeV')) || 0;
    },
  },
  bomCurrEaC: {
    type: DataTypes.STRING,
  },
  bomCurrEaV: {
    type: DataTypes.STRING,
    get() {
      return parseFloat(this.getDataValue('bomCurrEaV')) || 0;
    },
  },
  bomUsdEa: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomUsdUnit: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomUsdTotal: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomSupplier: {
    type: DataTypes.STRING,
  },
  bomPoDate: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('bomPoDate') === '0000-00-00' || !this.getDataValue('bomPoDate')) return '';
      return format(new Date(this.getDataValue('bomPoDate')), 'yyyy-MM-dd');
    },
  },
  bomPoNo: {
    type: DataTypes.STRING,
  },
  poZone: {
    type: DataTypes.STRING,
  },
  poNo: {
    type: DataTypes.STRING,
  },
  bomRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('bomRemarks')) ? '' : this.getDataValue('bomRemarks');
    },
  },
  bomEtaStatus: {
    type: DataTypes.STRING,
    get() {
      if ((this.bomQty > 0 && this.bomQtyStock > 0 && this.bomQtyBalance >= 0) || (this.bomDateRec && this.bomDateRec <= this.bomEta)) return 'ONTIME';
      if (this.bomEta === '0000-00-00' || !this.bomEta) return 'LATE';
      return '';
    },
  },
  bomStatus: {
    type: DataTypes.INTEGER,
  },
  whRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('whRemarks')) ? '' : this.getDataValue('whRemarks');
    },
  },
  prRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('prRemarks')) ? '' : this.getDataValue('prRemarks');
    },
  },
  rndRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('rndRemarks')) ? '' : this.getDataValue('rndRemarks');
    },
  },
  hvacRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('hvacRemarks')) ? '' : this.getDataValue('hvacRemarks');
    },
  },
  mechanicalRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('mechanicalRemarks')) ? '' : this.getDataValue('mechanicalRemarks');
    },
  },
  electronicRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('electronicRemarks')) ? '' : this.getDataValue('electronicRemarks');
    },
  },
  fabricationRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('fabricationRemarks')) ? '' : this.getDataValue('fabricationRemarks');
    },
  },
  sr: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isMpr: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  validasi: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  packing: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cancel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  poQty: {
    type: DataTypes.DOUBLE(18, 2),
  },
  poCurr: {
    type: DataTypes.STRING,
  },
  poVal: {
    type: DataTypes.STRING,
  },
  poRemarks: {
    type: DataTypes.TEXT,
    get() {
      return remarkBlacklist.includes(this.getDataValue('poRemarks')) ? '' : this.getDataValue('poRemarks');
    },
  },
  materialsProcessed: {
    type: DataTypes.DOUBLE(18, 2),
  },
  yetToPurchase: {
    type: DataTypes.DOUBLE(18, 2),
  },
  idMpr: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idWo: {
    type: DataTypes.INTEGER,
  },
  idModule: {
    type: DataTypes.INTEGER,
  },
  idHeader: {
    type: DataTypes.INTEGER,
  },
  idMaterial: {
    type: DataTypes.BIGINT(20),
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priority: {
    type: DataTypes.STRING,
  },
  colorClass: {
    type: DataTypes.VIRTUAL,
    get() {
      const outPoNo = this.outstandingPo ? this.outstandingPo.poNo : null;

      if (this.validasi && !this.cancel) return 'validated-row';
      if (this.bomQty > 0 && this.bomQtyStock > 0 && this.bomQtyBalance >= 0) return 'stock-row';
      if (this.bomQtyRec > 0 && this.bomPoNo && !this.cancel) return 'coming-row';
      if (outPoNo && this.bomQtyRec <= 0 && this.bomPoNo && this.poStatus !== 'Complete' && !this.bomDateRec) return 'issued-row';
      if (!outPoNo && this.bomQtyRec <= 0 && this.poNo && !this.hold && !this.cancel) return 'draft-row';
      if (this.hold) return 'hold-row';
      if (this.cancel) return 'cancel-row';
      return null;
    },
  },
}, {
  tableName: 'mpr_item',
  underscored: true,
  timestamps: false,
});

module.exports = {
  MPR, MPRMODULE, MPRITEM,
};
