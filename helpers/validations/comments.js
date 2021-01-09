const Joi = require('joi');
const { pickPropertiesFromErrorDetails } = require('./general');
const CustomError = require('../customError');

const comments = {
  validateNewComment(comment) {
    const schema = Joi.object({
      body: Joi.string().required(),
    });

    const { error } = schema.validate(comment);
    if (error) {
      throw new CustomError(400, 'VALIDATION_ERROR', 'Comment is not valid!',
        pickPropertiesFromErrorDetails(error.details, ['message', 'path']));
    }
  },
};

module.exports = comments;
