require('dotenv').config();

const app = require('./app');
const logger = require('./config/logger');

const PORT = Number(process.env.PORT) || 3004;

app.listen(PORT, () => {
    logger.info({ port: PORT }, 'about-service listening');
});