const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
    {
        userid: { type: Number, required: true },
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        costs: { type: Array, required: true },
        created_at: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema, 'reports');