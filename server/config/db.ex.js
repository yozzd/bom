const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://user:password@host/db');

module.exports = sequelize;
