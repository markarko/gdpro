const express = require('express');
const app = express();
const gdpRouter = require('./gdp');
const proteinRouter = require('./protein');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/gdp/', gdpRouter);
app.use('/protein/', proteinRouter);

app.use(express.static('public'));

app.listen(port, () => console.log('Listening on port ' + port));
