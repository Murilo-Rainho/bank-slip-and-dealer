require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { slips } = require('../routers'); 

const { errorHandler } = require('../services/middlewares');

const PORT = process.env.PORT || 8081;

const app = express();

app.use(bodyParser.json());

app.get('/ping', (_req, res, _next) => {
  return res.status(200).send('pong!');
});

app.use('/boleto', slips);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listen at port ${PORT}`));

module.exports = app;
