const { Sequelize } = require('sequelize');
const { Article, Comment } = require('../models');
const { articlesValidation, commentsValidation } = require('../helpers/validations');
const { formatPaginationParamaters } = require('../helpers/pagination');

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
  async getAllArticles(query) {
    const {
      perPage, page, sortedByThumbs, term,
    } = query;

    const { limit, offset } = formatPaginationParamaters(perPage, page);

    const baseQuery = {
      ...(term && {
        where: Sequelize.literal('MATCH (title,body) AGAINST (:term IN NATURAL LANGUAGE MODE)'),
        replacements: { term },
      }),
    };

    const findAllQuery = {
      ...baseQuery,
      offset,
      limit,
      ...((sortedByThumbs === 'true') && {
        order: [
          ['thumbsUp', 'DESC'],
        ],
      }),
    };

    const instances = await Article.findAll(findAllQuery);
    const { count: total } = await Article.findAndCountAll(baseQuery);
    return {
      articles: instances,
      total,
    };
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
  async getArticleComments(articleId, query) {
    const {
      perPage, page,
    } = query;
    const { limit, offset } = formatPaginationParamaters(perPage, page);

    await articlesValidation.validateArticlePrimaryKey(articleId);

    const { count: total } = await Comment.findAndCountAll({
      where: {
        ArticleId: articleId,
      },
    });
    const comments = await Comment.findAll({
      offset,
      limit,
      where: {
        ArticleId: articleId,
      },
    });
    return {
      comments,
      total,
    };
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
