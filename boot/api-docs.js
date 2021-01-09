const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

const { appUrl } = config;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog System',
      version: '1.0.0',
      description: 'A blog system where you can manage authors, articles and comments.',
    },
    servers: [
      {
        url: appUrl,
      },
    ],
  },
  tags: [
    { name: 'Articles' },
    { name: 'Authors' },
  ],
  apis: [
    './routes/articles.js',
    './routes/authors.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
  );
};
