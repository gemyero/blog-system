const { Author } = require('../models');
const { authorsValidation } = require('../helpers/validations');
const { formatPaginationParamaters } = require('../helpers/pagination');

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
  async getAllAuthors(query) {
    const { page, perPage } = query;
    const { limit, offset } = formatPaginationParamaters(perPage, page);

    const instances = await Author.findAll({
      limit,
      offset,
    });
    const total = await Author.count();
    return {
      authors: instances,
      total,
    };
  },
};

module.exports = authors;
