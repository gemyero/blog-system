const Joi = require('joi');
const { Author, Article } = require('../../models');
const { pickPropertiesFromErrorDetails } = require('./general');
const CustomError = require('../customError');

const articles = {
  async validateNewArticle(article) {
    const schema = Joi.object({
      id: Joi.number(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      AuthorId: Joi.number().required().external(async (value) => {
        const authors = await Author.findAll({
          attributes: ['id'],
          raw: true,
        });

        if (!authors.map((author) => author.id).includes(value)) {
          throw new CustomError(404, 'VALIDATION_ERROR', 'Author is not found!');
        }

        return value;
      }),
      thumbsUp: Joi.number().default(0),
    });

    try {
      await schema.validateAsync(article, { abortEarly: false });
    } catch (error) {
      throw new CustomError(400,
        'VALIDATION_ERROR',
        'Article is not valid!',
        pickPropertiesFromErrorDetails(error.details, ['message', 'path']));
    }
  },
  async validateArticlePrimaryKey(id) {
    const schema = Joi
      .number()
      .required()
      .external(async (value) => {
        const article = await Article.findByPk(value);
        if (!article) {
          throw new CustomError(404, 'VALIDATION_ERROR', 'Article is not found!');
        }
      });
    try {
      await schema.validateAsync(id, { abortEarly: false });
    } catch (error) {
      throw new CustomError(404, 'VALIDATION_ERROR', 'Article is not found!');
    }
  },
};

module.exports = articles;
