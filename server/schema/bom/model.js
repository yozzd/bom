const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Lt = sequelize.define('lt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  ltNo: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'bom_lt',
  underscored: true,
});

const Wo = sequelize.define('wo', {
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
  sttus: {
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

Lt.hasMany(Wo, {
  foreignKey: 'idLt',
});
Wo.belongsTo(Lt);

module.exports = { Lt, Wo };
