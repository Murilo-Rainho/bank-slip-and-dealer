const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8081;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Listen at port ${PORT}`));
