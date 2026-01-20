const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/user.model');
const Cost = require('../models/cost.model');
const Report = require('../models/report.model');

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
    await User.deleteMany({});
    await Cost.deleteMany({});
    await Report.deleteMany({});
});

test('POST /api/add adds cost when user exists', async () => {
    await User.create({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: new Date('1990-01-01') });

    const res = await request(app)
        .post('/api/add')
        .send({ userid: 123123, description: 'milk 9', category: 'food', sum: 8 })
        .expect(200);

    expect(res.body).toEqual({
        description: 'milk 9',
        category: 'food',
        userid: 123123,
        sum: 8
    });
});

test('POST /api/add returns 404 if user not found', async () => {
    const res = await request(app)
        .post('/api/add')
        .send({ userid: 999, description: 'x', category: 'food', sum: 1 })
        .expect(404);

    expect(res.body).toHaveProperty('id', 404);
});

test('GET /api/report returns grouped categories (empty arrays)', async () => {
    const res = await request(app)
        .get('/api/report?id=123123&year=2026&month=1')
        .expect(200);

    expect(res.body.userid).toBe(123123);
    expect(res.body.year).toBe(2026);
    expect(res.body.month).toBe(1);
    expect(Array.isArray(res.body.costs)).toBe(true);
});

test('GET /api/report includes cost in correct category', async () => {
    await User.create({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: new Date('1990-01-01') });

    await Cost.create({
        userid: 123123,
        description: 'choco',
        category: 'food',
        sum: 12,
        created_at: new Date('2026-01-17T10:00:00Z')
    });

    const res = await request(app)
        .get('/api/report?id=123123&year=2026&month=1')
        .expect(200);

    const foodObj = res.body.costs.find(o => Object.prototype.hasOwnProperty.call(o, 'food'));
    expect(foodObj.food.length).toBe(1);
    expect(foodObj.food[0]).toHaveProperty('sum', 12);
    expect(foodObj.food[0]).toHaveProperty('description', 'choco');
    expect(foodObj.food[0]).toHaveProperty('day');
});

test('Computed: past month report is cached in reports collection', async () => {
    await Cost.create({
        userid: 123123,
        description: 'old',
        category: 'food',
        sum: 5,
        created_at: new Date('2025-12-10T10:00:00Z')
    });

    await request(app)
        .get('/api/report?id=123123&year=2025&month=12')
        .expect(200);

    const cached = await Report.findOne({ userid: 123123, year: 2025, month: 12 }).lean();
    expect(cached).toBeTruthy();
});
