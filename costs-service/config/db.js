const mongoose = require('mongoose');

async function connectDb(mongoUri) {
    if(!mongoUri) {
        throw new Error('MONGO_URI is missing');
    }

    await mongoose.connect(mongoUri);
}

module.exports = connectDb;