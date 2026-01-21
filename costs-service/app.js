const express = require('express');
const costsRouter = require('./routes/costs.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const requestLogger = require('./middlewares/request-logger.middleware');

const app = express();

app.use(express.json());
app.use(requestLogger('costs-service'));
app.use('/api', costsRouter);

app.use(errorMiddleware);

module.exports = app;