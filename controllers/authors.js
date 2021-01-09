const { Author } = require('../models');
const { authorsValidation } = require('../helpers/validations');

const authors = {
  async addNewAuthor(author) {
    await authorsValidation.validateNewAuthor(author);
    const instance = await Author.create(author);
    return instance;
  },
  async getOneAuthor(id) {
    await authorsValidation.validateAuthorPrimaryKey(id);
    const instance = await Author.findByPk(id);
    return instance;
  },
  async getAllAuthors() {
    const instances = await Author.findAll({});
    return instances;
  },
};

module.exports = authors;
