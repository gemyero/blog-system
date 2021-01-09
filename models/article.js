const { DataTypes } = require('sequelize');
const { sequelize } = require('../boot/sequelize');

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  thumbsUp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Article;
