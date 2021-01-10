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
  const { id: authorId } = await Author.create({
    id: 1,
    ...authorsData[0],
  });
  await Article.create({
    ...articlesData[0],
    AuthorId: authorId,
    thumbsUp: 1,
  });

  await Article.create({
    ...articlesData[1],
    AuthorId: authorId,
  });
  t.context.authorId = authorId;
  t.context.axiosInstance = axios.create({
    baseURL: urlJoin(prefixUrl, 'api'),
  });
});

test.after.always(async (t) => {
  await Author.destroy({
    where: {
      id: t.context.authorId,
    },
  });
  await Article.destroy({ where: {} });
});

test.serial('List articles', async (t) => {
  const { data } = await t.context.axiosInstance.get('/articles');
  t.is(data.articles.length, 2);
  t.is(data.total, 2);
});

test.serial('List articles page 2 perPage 1', async (t) => {
  const { data } = await t.context.axiosInstance.get('/articles', { params: { perPage: 1, page: 1 } });
  t.is(data.articles.length, 1);
  t.is(data.total, 2);
});

test.serial('Search articles with keyword "word"', async (t) => {
  const { data } = await t.context.axiosInstance.get('/articles', { params: { term: 'word' } });
  t.is(data.articles.length, 2);
  t.is(data.total, 2);
});

test.serial('Search articles with keyword "phrase"', async (t) => {
  const { data } = await t.context.axiosInstance.get('/articles', { params: { term: 'phrase' } });
  t.is(data.articles.length, 1);
  t.is(data.total, 1);
});

test.serial('Sort articles by thumbs up', async (t) => {
  const { data } = await t.context.axiosInstance.get('/articles', { params: { sortedByThumbs: true } });
  t.is(data.articles[0].thumbsUp, 1);
  t.is(data.articles[1].thumbsUp, 0);
});
