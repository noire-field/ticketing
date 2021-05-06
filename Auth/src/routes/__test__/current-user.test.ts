import request from 'supertest';
import app from './../../app';

it('reponds with detail about the current user', async () => {
    const cookie = await global.Test_SignIn();

    const currentUser = await request(app).get('/api/users/current-user').set('Cookie', cookie).send({}).expect(400);

    expect(currentUser.body.currentUser.email).toEqual('test@test.com');
});

it('reponds with null if not authendicated', async () => {
    const currentUser = await request(app).get('/api/users/current-user').send({}).expect(200);

    expect(currentUser.body.currentUser).toEqual(null);
});