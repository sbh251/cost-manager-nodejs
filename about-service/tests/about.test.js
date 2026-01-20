const request = require('supertest');
const app = require('../app');

beforeAll(() => {
    process.env.TEAM_MEMBERS = JSON.stringify([
        { first_name: 'Amit', last_name: 'Onn' },
        { first_name: 'Moshe', last_name: 'Levi' }
    ]);
});

test('GET /api/about returns team members', async () => {
    const res = await request(app)
        .get('/api/about')
        .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('first_name');
    expect(res.body[0]).toHaveProperty('last_name');
    expect(Object.keys(res.body[0]).length).toBe(2);
});
