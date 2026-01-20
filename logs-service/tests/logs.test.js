const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const Log = require('../models/log.model');

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

beforeEach(async () => {
    await Log.deleteMany({});
});

test('GET /api/logs returns logs', async () => {
    await Log.create({ service: 'users-service', method: 'GET', path: '/api/users', status: 200 });

    const res = await request(app)
        .get('/api/logs')
        .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('service', 'users-service');
});
