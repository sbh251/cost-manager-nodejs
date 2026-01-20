const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/user.model');

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

beforeEach(async() => {
    await User.deleteMany({});
})

test('POST /api/add adds user', async() => {
    const res = await request(app)
        .post('/api/add')
        .send({ id: 123123, first_name: 'mosh', last_name: 'israeli', birthday: '1990-01-01' })
        .expect(200);

    expect(res.body.id).toBe(123123);
    expect(res.body.first_name).toBe('mosh');
    expect(res.body.last_name).toBe('israeli');
});

test('POST /api/add validates input', async () => {
    const res = await request(app)
        .post('/api/add')
        .send({ id: 'abc', first_name: '', last_name: 'x', birthday: 'bad-date' })
        .expect(400);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('message');
});

test('GET /api/users returns list', async () => {
    await User.create({ id: 1, first_name: 'a', last_name: 'b', birthday: new Date('2000-01-01') });

    const res = await request(app)
        .get('/api/users')
        .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(1);
});

test('GET /api/users/:id returns details + total=0 when no costs', async () => {
    await User.create({ id: 5, first_name: 'a', last_name: 'b', birthday: new Date('2000-01-01') });

    const res = await request(app)
        .get('/api/users/5')
        .expect(200);

    expect(res.body).toEqual({ first_name: 'a', last_name: 'b', id: 5, total: 0 });
});

test('GET /api/users/:id returns 404 if not found', async () => {
    const res = await request(app)
        .get('/api/users/999')
        .expect(404);

    expect(res.body).toHaveProperty('id', 404);
});