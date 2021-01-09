const _ = require('lodash');

const formatPaginationParamaters = (perPage = 10, page = 1) => {
  let newPerPage = parseInt(perPage, 10);
  let newPage = parseInt(page, 10);

  if (_.isNaN(perPage) || _.isNaN(page)) {
    newPerPage = 10;
    newPage = 1;
  }

  const offset = newPerPage * (newPage - 1);
  const limit = newPerPage;

  return {
    offset,
    limit,
  };
};

module.exports = {
  formatPaginationParamaters,
};
