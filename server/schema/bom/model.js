const fetch = require('node-fetch');
const { format } = require('date-fns');
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const { pssUrl, pssAuth } = require('../../config');

const remarkBlacklist = [
  '<p></p>', '<p> </p>', '<p><br></p>',
  '<p><strong><em><br></em></strong></p>',
];

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
      return {
        name: t.customer_name || 'PT. LABTECH PENTA INTERNATIONAL',
        contractDeadLine: t.contract_dead_line,
        productionDeadLine: t.production_dead_line,
      };
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
  timestamps: false,
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
      return format(new Date(this.getDataValue('issued')), 'yyyy-MM-dd');
    },
  },
  totalIncoming: {
    type: DataTypes.VIRTUAL,
  },
  totalIncomingItems: {
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
      if (this.totalIncoming && this.totalItems) {
        return (this.totalIncoming / this.totalIncomingItems) * 100;
      }
      return 0;
    },
  },
  percentValidation: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.totalValidation && this.totalItems) {
        return (this.totalValidation / this.totalItems) * 100;
      }
      return 0;
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
  totalMaterialsProcessed: {
    type: DataTypes.VIRTUAL,
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
  totalMpr: {
    type: DataTypes.VIRTUAL,
  },
}, {
  tableName: 'bom_wo',
  underscored: true,
  timestamps: false,
});

const WOMODULE = sequelize.define('module', {
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
  timestamps: false,
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
  idHeader: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idModule: {
    type: DataTypes.VIRTUAL,
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
  tableName: 'bom_data',
  underscored: true,
  timestamps: false,
});

module.exports = {
  LT, WO, WOMODULE, WOITEM, remarkBlacklist,
};
