const express = require('express');
const helmet = require('helmet');
const { sequelize } = require('./boot/sequelize');
const config = require('./config');
const appRouter = require('./routes');
const registerApiDocs = require('./boot/api-docs');

const {
  port, host, appUrl, nodeEnv,
} = config;

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api', appRouter);
registerApiDocs(app);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).send({
    code: error.code,
    message: error.message,
    details: error.details,
  });
});

(async () => {
  if (nodeEnv !== 'test') {
    await sequelize.sync();
    console.log('Connected to MySQL...');
    app.listen(port, host, () => {
      console.log(`App url: ${appUrl}`);
    });
  }
})();

module.exports = app;
