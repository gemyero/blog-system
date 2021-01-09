const Author = require('./author');
const Article = require('./article');
const Comment = require('./comment');

Author.hasMany(Article);
Article.belongsTo(Author);

Article.hasMany(Comment);
Comment.belongsTo(Article);

module.exports = {
  Author,
  Article,
  Comment,
};
