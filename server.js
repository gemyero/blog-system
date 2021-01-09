const express = require('express');
const helmet = require('helmet');
const { sequelize } = require('./boot/sequelize');
const config = require('./config');
const appRouter = require('./routes');

const { port, host, appUrl } = config;

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api', appRouter);

app.use((error, req, res, next) => {
  res.status(error.statusCode).send({
    code: error.code,
    message: error.message,
    details: error.details,
  });
});

(async () => {
  await sequelize.sync();
  console.log('Connected to MySQL...');
  app.listen(port, host, () => {
    console.log(`App url: ${appUrl}`);
  });
})();
