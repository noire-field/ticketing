import request from 'supertest';
import app from './../../app';

it('clears the cookie after signing out', async () => {
    const response1 = await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(201);

    expect(response1.get('Set-Cookie')).toBeDefined(); 

    const response2 = await request(app).post('/api/users/sign-out').send({}).expect(200);

    expect(response2.get('Set-Cookie')[0]).toEqual(`express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly`);
});