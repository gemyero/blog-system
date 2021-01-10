const test = require('ava');
const listen = require('test-listen');
const http = require('http');
const axios = require('axios').default;
const urlJoin = require('url-join');
const app = require('../../server');
const { sequelize } = require('../../boot/sequelize');
const authorsData = require('../data/authors');
const articlesData = require('../data/articles');
const { Author, Article } = require('../../models');

test.before(async (t) => {
  const server = http.createServer(app);
  const prefixUrl = await listen(server);
  await sequelize.sync();
  t.context.axiosInstance = axios.create({
    baseURL: urlJoin(prefixUrl, 'api'),
  });
});

test.serial('Thumb up one article', async (t) => {
  t.teardown(async () => {
    await Article.destroy({
      where: {
        id: 1,
      },
    });

    await Author.destroy({
      where: {
        id: 1,
      },
    });
  });

  await Author.create({
    id: 1,
    ...authorsData[0],
  });

  await Article.create({
    id: 1,
    ...articlesData[0],
    AuthorId: 1,
  });

  const { data } = await t.context.axiosInstance.patch('/articles/1/thumbUp');
  t.is(data.thumbsUp, 1);
});
