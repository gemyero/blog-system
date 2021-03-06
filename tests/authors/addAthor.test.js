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

test.serial('Create Author', async (t) => {
  t.teardown(async () => {
    await Author.destroy({
      where: {
        id: 1,
      },
    });
  });

  await t.context.axiosInstance.post('/authors', {
    id: 1,
    ...authorsData[0],
  });
  const author = await Author.findByPk(1);
  t.is(author.name, authorsData[0].name);
  t.is(author.job, authorsData[0].job);
});
