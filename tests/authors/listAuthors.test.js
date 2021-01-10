const test = require('ava');
const listen = require('test-listen');
const http = require('http');
const axios = require('axios').default;
const urlJoin = require('url-join');
const app = require('../../server');
const { sequelize } = require('../../boot/sequelize');
const authorsData = require('../data/authors');
const { Author } = require('../../models');

test.before(async (t) => {
  const server = http.createServer(app);
  const prefixUrl = await listen(server);
  await sequelize.sync();
  await Author.create(authorsData[0]);
  await Author.create(authorsData[1]);
  t.context.axiosInstance = axios.create({
    baseURL: urlJoin(prefixUrl, 'api'),
  });
});

test.after.always(async (t) => {
  await Author.destroy({ where: {} });
});

test.serial('List authors', async (t) => {
  const { data } = await t.context.axiosInstance.get('/authors');
  t.is(data.authors.length, 2);
  t.is(data.total, 2);
});

test.serial('List authors page 2 perPage 1', async (t) => {
  const { data } = await t.context.axiosInstance.get('/authors', { params: { perPage: 1, page: 1 } });
  t.is(data.authors.length, 1);
  t.is(data.total, 2);
});
