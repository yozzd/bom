const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Supplier = sequelize.define('supplier', {
  suplierID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  suplierNM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ContactPerson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.TEXT,
  },
  Country: {
    type: DataTypes.STRING,
  },
  PostCode: {
    type: DataTypes.STRING,
  },
  MobilePerson: {
    type: DataTypes.STRING,
  },
  OfficePhone: {
    type: DataTypes.STRING,
  },
  OfficePhone1: {
    type: DataTypes.STRING,
  },
  FaxNo: {
    type: DataTypes.STRING,
  },
  Email: {
    type: DataTypes.STRING,
  },
  HomePage: {
    type: DataTypes.STRING,
  },
  Remark: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'suplier',
  timestamps: false,
});

module.exports = { Supplier };
