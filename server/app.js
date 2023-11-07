const express = require('express');
const path = require('path');
const app = express();
const mainRouter = express.Router();
const gdpRouter = require('./routes/gdp');
const proteinRouter = require('./routes/protein');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swagger-docs.json');

app.use(express.json());

mainRouter.use('/gdp/', gdpRouter);
mainRouter.use('/protein/', proteinRouter);

app.use('/api/v1', mainRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);
  
module.exports = app;