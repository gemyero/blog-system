const { Sequelize } = require('sequelize');
const config = require('../config');

const { mysqlUrl } = config;

const sequelize = new Sequelize(mysqlUrl, { logging: false });

module.exports = {
  sequelize,
};
