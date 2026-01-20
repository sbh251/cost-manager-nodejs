function errorMiddleware(err, req, res, next) {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'internal error';

    res.status(status).json({ id: status, message: message });
}

module.exports = errorMiddleware;