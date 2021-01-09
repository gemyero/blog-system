const definedEnvs = Object.keys(process.env);

const getEnv = (envName, required = true) => {
  if (required && !definedEnvs.includes(envName)) throw new Error(`${envName} missing`);
  return process.env[envName];
};

module.exports = {
  port: +getEnv('PORT', false) || 3000,
  host: getEnv('HOST', false) || '0.0.0.0',
  mysqlUrl: getEnv('MYSQL_URL'),
  appUrl: getEnv('APP_URL', false) || 'http://localhost:3000/',
};
