import request from 'supertest';
import app from './../../app';
import mongoose from 'mongoose';

it('returns 404 if a ticket is not found', async () => {
    await request(app).get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`).send().expect(404);
});

it('returns the ticket if ticket is found', async () => {
    const ticket = {
        title: "Hololive",
        price: 100
    }

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.Test_SignIn())
        .send(ticket);

    expect(response.status).toEqual(201);
     
    const getResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200) 
    
    expect(getResponse.body.title).toEqual(ticket.title);
    expect(getResponse.body.price).toEqual(ticket.price);
});