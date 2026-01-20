const mongoose = require('mongoose');

const costSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        category: { type: String, required: true },
        userid: { type: Number, required: true },
        sum: { type: Number, required: true },
        created_at: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model('Cost', costSchema, 'costs');