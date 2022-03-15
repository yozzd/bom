const fetch = require('node-fetch');
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { pssUrl, pssAuth } = require('../../config');

const LT = sequelize.define('lt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  ltNo: {
    type: DataTypes.STRING,
  },
  customer: {
    type: DataTypes.VIRTUAL,
    async get() {
      const no = this.ltNo.split(' ').join('+');
      const headers = { Authorization: pssAuth };
      const info = await fetch(`${pssUrl}${no}`, { headers });
      const t = await info.json();
      return t.customer_name || 'PT. LABTECH PENTA INTERNATIONAL';
    },
  },
  totalBudget: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.wos.reduce((a, b) => a + b.budget, 0);
    },
  },
  totalPriceWO: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.wos.reduce((a, b) => a + b.totalPricePerWO, 0);
    },
  },
}, {
  tableName: 'bom_lt',
  underscored: true,
});

const WO = sequelize.define('wo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  woNo: {
    type: DataTypes.STRING,
  },
  idLt: {
    type: DataTypes.INTEGER,
  },
  unit: {
    type: DataTypes.INTEGER,
  },
  cat: {
    type: DataTypes.TEXT,
  },
  model: {
    type: DataTypes.TEXT,
  },
  product: {
    type: DataTypes.TEXT,
  },
  pic: {
    type: DataTypes.INTEGER,
  },
  picName: {
    type: DataTypes.TEXT,
  },
  rndic: {
    type: DataTypes.TEXT,
  },
  sgd: {
    type: DataTypes.DECIMAL(10, 2),
  },
  idr: {
    type: DataTypes.INTEGER,
  },
  euro: {
    type: DataTypes.DECIMAL(10, 2),
  },
  gbp: {
    type: DataTypes.DECIMAL(10, 2),
  },
  myr: {
    type: DataTypes.DECIMAL(10, 2),
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    get() {
      return parseFloat(this.getDataValue('budget')) || 0;
    },
  },
  refer: {
    type: DataTypes.TEXT,
  },
  stage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  validated: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  issued: {
    type: DataTypes.DATE,
    get() {
      if (this.getDataValue('issued') === '0000-00-00' || !this.getDataValue('issued')) return '';
      return this.getDataValue('issued');
    },
  },
  totalIncoming: {
    type: DataTypes.VIRTUAL,
  },
  totalValidation: {
    type: DataTypes.VIRTUAL,
  },
  totalItems: {
    type: DataTypes.VIRTUAL,
  },
  percentIncoming: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.totalIncoming / this.totalItems) * 100;
    },
  },
  percentValidation: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.totalValidation / this.totalItems) * 100;
    },
  },
  totalPricePerWO: {
    type: DataTypes.VIRTUAL,
  },
  totalPricePerUnit: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.totalPricePerWO / this.unit;
    },
  },
  difference: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.budget - this.totalPricePerWO;
    },
  },
  totalYetToPurchase: {
    type: DataTypes.VIRTUAL,
  },
  totalDeviation: {
    type: DataTypes.VIRTUAL,
  },
  totalPackingPerWO: {
    type: DataTypes.VIRTUAL,
  },
  totalPackingPerUnit: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.totalPackingPerWO / this.unit;
    },
  },
}, {
  tableName: 'bom_wo',
  underscored: true,
});

const WOHEADER = sequelize.define('header', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  hid: {
    type: DataTypes.STRING,
  },
  header: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idWo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idLt: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bom_header',
  underscored: true,
});

const WOITEM = sequelize.define('item', {
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
      // Note: need to check po arrival date
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
    defaultValue: 0,
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
  idHeader: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idWo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idLt: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idMaterial: {
    type: DataTypes.BIGINT(20),
  },
  hold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  priority: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'bom_data',
  underscored: true,
});

LT.hasMany(WO, {
  foreignKey: 'idLt',
  targetKey: 'id',
});
WO.belongsTo(LT);

WO.hasMany(WOHEADER, {
  foreignKey: 'idWo',
  targetKey: 'id',
});
WOHEADER.belongsTo(WO);

WOHEADER.hasMany(WOITEM, {
  foreignKey: 'idHeader',
  targetKey: 'id',
});
WOITEM.belongsTo(WOHEADER);

module.exports = {
  LT, WO, WOHEADER, WOITEM,
};
