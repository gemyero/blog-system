const { Sequelize } = require('sequelize');
const config = require('../config');

const { mysqlUrl } = config;

const sequelize = new Sequelize(mysqlUrl, { logging: false, retry: { max: 10 } });

module.exports = {
  sequelize,
};
