import request from 'supertest';
import mongoose from 'mongoose';
import app from './../../app';
import { Ticket } from './../../models/Ticket';

const MakeTicket = async () => {
    const ticket = Ticket.Build({ 
        id: mongoose.Types.ObjectId().toHexString(),
        title: "Concert", price: 20 
    });

    await ticket.save();
    
    return ticket;
}


it('fetches orders for an particular user', async () => {
    // Make 3 tickets
    const ticketOne = await MakeTicket();
    const ticketTwo = await MakeTicket();
    const ticketThree = await MakeTicket();

    // Make 2 users
    const userOne = global.Test_SignIn();
    const userTwo = global.Test_SignIn();

    // User #1 owns ticket #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // User #2 owns ticket #1 and #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    // Fetch user #2's tickets
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});