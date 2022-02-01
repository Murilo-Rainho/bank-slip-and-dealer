require('dotenv').config();

const configs = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.HOSTNAME,
  dialect: 'mysql',
};

module.exports = {
  development: {
    ...configs,
  },
  test: {
    ...configs,
  },
  production: {
    ...configs,
  },
};