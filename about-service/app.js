const express = require('express');
const aboutRoutes = require('./routes/about.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use('/api', aboutRoutes);
app.use(errorMiddleware);

module.exports = app;