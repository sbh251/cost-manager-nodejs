const express = require('express');
const userRoutes = require('./routes/users.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

app.use(errorMiddleware);

module.exports = app;