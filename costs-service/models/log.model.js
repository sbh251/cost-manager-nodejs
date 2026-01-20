const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
        service: { type: String, required: true },
        method: { type: String, required: true },
        path: { type: String, required: true },
        status: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model('Log', logSchema, 'logs');