const express = require('express');
const logsRoutes = require('./routes/logs.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use('/api', logsRoutes);
app.use(errorMiddleware);

module.exports = app;