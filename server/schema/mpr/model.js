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
      return this.getDataValue('bomEta');
    },
  },
  bomQtyRec: {
    type: DataTypes.DOUBLE(18, 2),
  },
  bomDateRec: {
    type: DataTypes.DATE,
    get() {
      // Note: need to check po arrival date & add more conditions
      if (this.getDataValue('bomDateRec') === '0000-00-00' || !this.getDataValue('bomDateRec')) return '';
      return this.getDataValue('bomDateRec');
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
      return this.getDataValue('bomPoDate');
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
      const arr = ['<p> </p>', '<p><br></p>'];
      return arr.includes(this.getDataValue('bomRemarks')) ? '' : this.getDataValue('bomRemarks');
    },
  },
  bomEtaStatus: {
    type: DataTypes.STRING,
    get() {
      // Note: need to check po arrival date & add more conditions
      if (this.bomQty > 0 && this.bomQtyStock > 0 && this.bomQtyBalance >= 0) return 'ONTIME';
      return '';
    },
  },
  bomStatus: {
    type: DataTypes.INTEGER,
  },
  whRemarks: {
    type: DataTypes.TEXT,
  },
  prRemarks: {
    type: DataTypes.TEXT,
  },
  rndRemarks: {
    type: DataTypes.TEXT,
  },
  hvacRemarks: {
    type: DataTypes.TEXT,
  },
  mechanicalRemarks: {
    type: DataTypes.TEXT,
  },
  electronicRemarks: {
    type: DataTypes.TEXT,
  },
  fabricationRemarks: {
    type: DataTypes.TEXT,
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
    allowNull: false,
  },
  idModule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idHeader: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idMaterial: {
    type: DataTypes.BIGINT(20),
  },
  timestamp: {
    type: DataTypes.DATE(6),
    allowNull: false,
  },
  hold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priority: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'mpr_item',
  underscored: true,
});

MPR.hasMany(MPRMODULE, {
  foreignKey: 'idMpr',
  targetKey: 'id',
});
MPRMODULE.belongsTo(MPR);

MPRMODULE.hasMany(MPRITEM, {
  foreignKey: 'idModule',
  targetKey: 'id',
});
MPRITEM.belongsTo(MPRMODULE);

module.exports = {
  MPR, MPRMODULE, MPRITEM,
};