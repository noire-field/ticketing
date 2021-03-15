import request from 'supertest';
import app from './../../app';

it('fails when supplied email does not exist', async () => {
    await request(app).post('/api/users/sign-in').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(400);
})

it('fails when an incorrect password is supplied', async () => {
    await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(201);

    await request(app).post('/api/users/sign-in').send({
        email: "noirefield@gmail.com",
        password: "123"
    }).expect(400);
})

it('reponds with a cookie when given valid credentials', async () => {
    await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(201);

    const response = await request(app).post('/api/users/sign-in').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
})