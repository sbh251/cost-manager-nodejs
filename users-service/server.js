require('dotenv').config();

const app = require('./app');
const connectDb = require('./config/db');
const logger = require('./config/logger');
const requestLogger = require('./middlewares/request-logger.middleware');

const PORT = Number(process.env.PORT) || 3002;
const MONGO_URI = process.env.MONGO_URI;

app.use(requestLogger('users-service'));

async function start() {
    await connectDb(MONGO_URI);

    app.listen(PORT, () => {
        logger.info({ port: PORT }, 'users-service listening');
    });
}

start().catch((e) => {
    logger.error({ err: e.message }, 'failed to start');
    process.exit(1);
});