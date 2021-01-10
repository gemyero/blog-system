const test = require('ava');
const listen = require('test-listen');
const http = require('http');
const axios = require('axios').default;
const urlJoin = require('url-join');
const app = require('../../server');
const { sequelize } = require('../../boot/sequelize');
const authorsData = require('../data/authors');
const articlesData = require('../data/articles');
const { Author, Article, Comment } = require('../../models');

test.before(async (t) => {
  const server = http.createServer(app);
  const prefixUrl = await listen(server);
  await sequelize.sync();
  t.context.axiosInstance = axios.create({
    baseURL: urlJoin(prefixUrl, 'api'),
  });
});

test.serial('list article comments', async (t) => {
  t.teardown(async () => {
    await Comment.destroy({ where: {} });

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
  });

  await Comment.create({
    id: 1,
    ...articlesData[0],
    ArticleId: 1,
  });

  await Comment.create({
    id: 2,
    ...articlesData[0],
    ArticleId: 1,
  });

  const { data } = await t.context.axiosInstance.get('/articles/1/comments');

  t.is(data.comments.length, 2);
  t.is(data.total, 2);
  t.is(data.comments[0].ArticleId, 1);
  t.is(data.comments[1].ArticleId, 1);
});
