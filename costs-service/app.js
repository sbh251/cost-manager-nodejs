const express = require('express');
const costsRouter = require('./routes/costs.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/api', costsRouter);

app.use(errorMiddleware);

module.exports = app;