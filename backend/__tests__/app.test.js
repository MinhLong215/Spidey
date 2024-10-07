const request = require('supertest');
const app = require('../app'); // Đảm bảo đường dẫn đến file app.js của bạn

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });
});