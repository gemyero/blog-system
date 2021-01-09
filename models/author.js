const { DataTypes } = require('sequelize');
const { sequelize } = require('../boot/sequelize');

const Author = sequelize.define('Author', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  job: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Author;
