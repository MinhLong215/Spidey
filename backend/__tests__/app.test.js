const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    it('should return 200 OK', async () => {
    // Thêm mã xác thực nếu cần thiết
        const agent = request.agent(app);
        await agent.post('/login') // giả định rằng bạn có một endpoint đăng nhập
            .send({ username: 'milesmorales', password: 'user@1' }); // Điền thông tin đăng nhập

        const res = await agent.get('/');
        expect(res.statusCode).toBe(200);
    });
});
