const Log = require('../models/log.model');
const logger = require('../config/logger');

function requestLogger(serviceName) {
    return function requestLoggerMiddleware(req, res, next) {
        const start = Date.now();

        res.on('finish', async () => {
            const ms = Date.now() - start;

            logger.info(
                { service: serviceName, method: req.method, path: req.originalUrl, status: res.statusCode, ms: 'ms'},
                'http request'
            );

            try {
                await Log.create({
                    service: serviceName,
                    method: req.method,
                    path: req.originalUrl,
                    status: res.statusCode
                });
            } catch (e) {
                logger.warn({ err: e.message }, 'failed writing log to db');
            }
        });

        next();
    };
}

module.exports = requestLogger;