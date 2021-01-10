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

test.serial('Add comment to article', async (t) => {
  t.teardown(async () => {
    await Comment.destroy({
      where: {
        body: 'comment1',
      },
    });

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

  const { data } = await t.context.axiosInstance.patch('/articles/1/comments', {
    body: 'comment1',
  });

  const comment = await Comment.findByPk(data.id);
  t.is(comment.body, 'comment1');
  t.is(comment.ArticleId, 1);
});
