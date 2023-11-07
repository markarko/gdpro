const express = require('express');
const path = require('path');
const app = express();
const mainRouter = express.Router();
const gdpRouter = require('./routes/gdp');
const proteinRouter = require('./routes/protein');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());

mainRouter.use('/gdp/', gdpRouter);
mainRouter.use('/protein/', proteinRouter);

app.use('/api/v1', mainRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'GDPro Express API with Swagger',
      version: '0.1.0',
      description:
          'GDPro\'s Express APIs documentation with Swagger. ',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./server/routes/*.js'],
};
  
const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
  
module.exports = app;