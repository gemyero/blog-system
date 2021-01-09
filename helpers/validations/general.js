const _ = require('lodash');

const pickPropertiesFromErrorDetails = (details, properties) => details
  .map((detail) => _.pick(detail, properties));

module.exports = {
  pickPropertiesFromErrorDetails,
};
