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
  t.context.axiosInstance = axios.create({
    baseURL: urlJoin(prefixUrl, 'api'),
  });
});

test.serial('Get one author', async (t) => {
  t.teardown(async () => {
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

  const { data } = await t.context.axiosInstance.get('/authors/1');
  t.is(data.id, 1);
});
