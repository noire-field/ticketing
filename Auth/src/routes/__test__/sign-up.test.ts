import request from 'supertest';
import app from './../../app';

it('should return a 201 on successful signup', async () => {
    return request(app).post('/api/users/sign-up').send({
        email: 'test@test.com',
        password: '123456'
    }).expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app).post('/api/users/sign-up').send({
        email: 'some-invalid-email',
        password: '123456'
    }).expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app).post('/api/users/sign-up').send({
        email: 'noirefield@gmail.com',
        password: 'one'
    }).expect(400);
});


it('returns a 400 with missing email, password', async () => {
    await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com"
    }).expect(400);

    await request(app).post('/api/users/sign-up').send({
        password: "noirefield"
    }).expect(400);

});

it('disallow duplicate emails', async () => {
    await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(201);

    await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app).post('/api/users/sign-up').send({
        email: "noirefield@gmail.com",
        password: "123456"
    }).expect(201);

    expect(response.get('Set-Cookie')).toBeDefined(); 
})