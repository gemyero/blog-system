const Joi = require('joi');
const { pickPropertiesFromErrorDetails } = require('./general');
const { Author } = require('../../models');
const CustomError = require('../customError');

const authors = {
  async validateNewAuthor(author) {
    const schema = Joi.object({
      id: Joi.number(),
      name: Joi.string().required(),
      job: Joi.string().required(),
    });

    try {
      await schema.validateAsync(author, { abortEarly: false });
    } catch (error) {
      throw new CustomError(400,
        'VALIDATION_ERROR',
        'Author is not valid!',
        pickPropertiesFromErrorDetails(error.details, ['message', 'path']));
    }
  },
  async validateAuthorPrimaryKey(id) {
    const schema = Joi
      .number()
      .required()
      .external(async (value) => {
        const author = await Author.findByPk(value);
        if (!author) {
          throw new CustomError(404, 'VALIDATION_ERROR', 'Author is not found!');
        }
        return value;
      });
    try {
      await schema.validateAsync(id, { abortEarly: false });
    } catch (error) {
      throw new CustomError(404, 'VALIDATION_ERROR', 'Author is not found!');
    }
  },
};

module.exports = authors;
