const Log = require('../models/log.model');

async function listLogs(req, res, next) {
    try {
        const logs = await Log.find({}).sort({ timestamp: -1 }).lean();
        return res.status(200).json(logs);
    } catch (e) {
        return next();
    }
}

module.exports = { listLogs };