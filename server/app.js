const express = require('express');
const app = express();
const mainRouter = express.Router();
const gdpRouter = require('./routes/gdp');
const proteinRouter = require('./routes/protein');

app.use(express.json());

mainRouter.use('/gdp/', gdpRouter);
mainRouter.use('/protein/', proteinRouter);

app.use('/api/v1', mainRouter);

app.use(express.static('public'));

module.exports = app;