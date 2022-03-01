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
  },
}, {
  tableName: 'bom_wo',
  underscored: true,
});

LT.hasMany(WO, {
  foreignKey: 'idLt',
});
WO.belongsTo(LT);

module.exports = { LT, WO };
