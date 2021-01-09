const { Article, Comment } = require('../models');
const { articlesValidation, commentsValidation } = require('../helpers/validations');

const articles = {
  async addNewArticle(article) {
    await articlesValidation.validateNewArticle(article);
    const instance = await Article.create(article);
    return instance;
  },
  async getOneArticle(id) {
    await articlesValidation.validateArticlePrimaryKey(id);
    const instance = await Article.findByPk(id);
    return instance;
  },
  async getAllArticles(sortedByThumbs = false) {
    const instances = await Article.findAll({
      ...(sortedByThumbs && {
        order: [
          ['thumbsUp', 'DESC'],
        ],
      }),
    });
    return instances;
  },
  async addNewCommentToArticle(articleId, commentData) {
    await articlesValidation.validateArticlePrimaryKey(articleId);
    commentsValidation.validateNewComment(commentData);
    const comment = await Comment.create({
      ...commentData,
      ArticleId: articleId,
    });
    return comment;
  },
  async getArticleComments(articleId) {
    await articlesValidation.validateArticlePrimaryKey(articleId);
    const comments = await Comment.findAll({
      where: {
        ArticleId: articleId,
      },
    });
    return comments;
  },
  async incrementThumbUps(articleId) {
    await articlesValidation.validateArticlePrimaryKey(articleId);
    await Article.increment('thumbsUp', {
      where: {
        id: articleId,
      },
    });
    const article = await this.getOneArticle(articleId);
    return article;
  },
};

module.exports = articles;
